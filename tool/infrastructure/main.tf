variable "access_key" {}
variable "secret_key" {}
variable "ssh_key_name" {}
variable "ssh_key_local_path" {}
variable "region" {}
variable "prefix" {}
variable "suffix" {}


# Provider
provider "alicloud" {
    access_key = "${var.access_key}"
    secret_key = "${var.secret_key}"
    region = "${var.region}"
}

# VPC
resource "alicloud_vpc" "vpc" {
    cidr_block = "192.168.0.0/16"
    name = "${var.prefix}vpc${var.suffix}"
}

# VSwitch
data "alicloud_zones" "zones" {
  available_resource_creation = "VSwitch"
}
resource "alicloud_vswitch" "vswitch" {
    vpc_id = "${alicloud_vpc.vpc.id}"
    availability_zone = "${data.alicloud_zones.zones.zones.0.id}"
    cidr_block = "192.168.0.0/24"
    name = "${var.prefix}switch${var.suffix}"
}

# Security group
resource "alicloud_security_group" "sg" {
    vpc_id = "${alicloud_vpc.vpc.id}"
    name = "${var.prefix}sg${var.suffix}"
}
resource "alicloud_security_group_rule" "sgr80" {
    security_group_id = "${alicloud_security_group.sg.id}"
    type = "ingress"
    ip_protocol = "tcp"
    nic_type = "intranet"
    policy = "accept"
    port_range = "80/80"
    priority = 1
    cidr_ip = "0.0.0.0/0"
}
resource "alicloud_security_group_rule" "sgr22" {
    security_group_id = "${alicloud_security_group.sg.id}"
    type = "ingress"
    ip_protocol = "tcp"
    nic_type = "intranet"
    policy = "accept"  # accept or drop. (use accept when you need ssh)
    port_range = "22/22"
    priority = 1
    cidr_ip = "0.0.0.0/0"
}

# ECS
data "alicloud_images" "centos" {
  name_regex  = "^centos_7.*vhd$"
  most_recent = true
  owners      = "system"
}
data "alicloud_instance_types" "2c4g" {
  cpu_core_count = 2
  memory_size = 4
  availability_zone = "${data.alicloud_zones.zones.zones.0.id}"
}
# ECS 1
resource "alicloud_instance" "ecs1" {
    availability_zone = "${alicloud_vswitch.vswitch.availability_zone}"
    security_groups = ["${alicloud_security_group.sg.id}"]
    vswitch_id = "${alicloud_vswitch.vswitch.id}"
    image_id = "${data.alicloud_images.centos.images.0.id}"
    instance_type = "${data.alicloud_instance_types.2c4g.instance_types.0.id}"
    instance_name = "${var.prefix}ecs1${var.suffix}"
    key_name = "${var.ssh_key_name}"
}
# EIP (ecs1)
resource "alicloud_eip" "eip_ecs1" {
    bandwidth = "10"
    name = "${var.prefix}eip-ecs1${var.suffix}"
}
resource "alicloud_eip_association" "eip_ecs1_asso" {
    allocation_id = "${alicloud_eip.eip_ecs1.id}"
    instance_id   = "${alicloud_instance.ecs1.id}"

    provisioner "remote-exec" {
        script = "provision-remote-1.sh"
        connection {
            type = "ssh"
            user = "root"
            private_key = "${file(var.ssh_key_local_path)}"
            host = "${alicloud_eip.eip_ecs1.ip_address}"
            timeout = "1m"
        }
    }
    provisioner "local-exec" {
        command = "rm -rf ../app/server/node_modules/ && rm -rf ../app/server/static/node_modules/ && scp -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -r -i ${var.ssh_key_local_path} ../app/ root@${alicloud_eip.eip_ecs1.ip_address}:/usr/local/src/"
    }
    provisioner "remote-exec" {
        script = "provision-remote-2.sh"
        connection {
            type = "ssh"
            user = "root"
            private_key = "${file(var.ssh_key_local_path)}"
            host = "${alicloud_eip.eip_ecs1.ip_address}"
            timeout = "1m"
        }
    }
}


# Output
output "[debug] vpc id" {
    value = "${alicloud_vpc.vpc.id}"
}
output "[debug] ecs1 id" {
    value = "${alicloud_instance.ecs1.id}"
}
output "[debug] ecs1 image_id" {
    value = "${alicloud_instance.ecs1.image_id}"
}
output "[debug] eip_ecs1 ip_address" {
    value = "${alicloud_eip.eip_ecs1.ip_address}"
}
