# Image Search OSS import metafile generator


## Summary
0. [Introduction](#introduction)
1. [Prerequisite](#prerequisite)
2. [Usage](#usage)
3. [Support](#support)


## Introduction

This is a supporting tool for creating a increment.meta file, which is a configuration file to import image files from [OSS](https://www.alibabacloud.com/help/product/31815.htm), to [Image Search](https://www.alibabacloud.com/help/product/66413.htm) instance. About increment.meta file, you can see more information from [this document](https://www.alibabacloud.com/help/doc-detail/66580.htm).

You can choose running a temporary server of this tool on local or on cloud. Please select one which you prefer, and follow the steps.


## Prerequisite

### Local environment requirements (For running on local)

* npm

* Node.js

This application uses [Express](https://expressjs.com/) as web application server framework, which is fast Node.js framework. It also uses [Vue.js](https://vuejs.org/index.html) as web application front-end framework, which is light weight javascript framework. To run them, you have to install [npm](https://github.com/npm/cli) and [Node.js](https://nodejs.org/) on your local machine.

You can check your environment with the following commands in a terminal:
```bash
# Check that npm is installed
npm -v

# Check that node is installed
node -v
```

### Local environment requirements (For running on ECS)

* Terraform

You can run this application on [Alibaba Cloud ECS](https://www.alibabacloud.com/help/doc-detail/25367.htm). If you want to run it on ECS, you don't have to install npm or node, but you have to install Terraform on your local machine, which is powerful tool to construct cloud infrastructure. You can install Terraform from [here](https://www.terraform.io/).

You can check your environment with the following command in a terminal:

```bash
terraform -version
```

Before creating the application, you need to prepare account credentials of Alibaba Cloud.

1. Create an Alibaba Cloud account

    You need an Alibaba Cloud account. If you don't have any account, please follow
    [this document to create one](https://www.alibabacloud.com/help/doc-detail/50482.htm).

2. Create an access key

    You need an accessKeyId and an accessKeySecret to create your Alibaba Cloud products by Terraform. Please follow
    [this document to obtain an access key id and secret](https://www.alibabacloud.com/help/faq-detail/63482.htm).


## Usage

### Running on local

0. Clone this repository

1. Build

    First, run the following commands in a terminal to initialize the application.

    ```
    cd app/server
    npm run init
    ```

2. Run a local server

    Then, you can start server with folloing command.

    ```
    npm run start
    ```

3. Use the tool

    1. Access to http://localhost:3000

    2. Input your credentials to the form and submit it to get images in your bucket.

    3. Check image list and change the properties for each image if you need.

    4. Click incremant.meta file download link at the bottom.


### Running on ECS

0. Clone this repository

1. Change directory

    ```
    cd infrastructure/
    ```

2. Create and edit Terraform variable file

    1. Create the file

        ```bash
        touch terraform.tfvars
        ```

    2. Edit the file to set your information

        ```sh
        # The access key id of the Alibaba Cloud account
        access_key = "xxxxxxxxxxxxxxxx"
        # The access key secret of the Alibaba Cloud account
        secret_key = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        # The ssh key name of the Alibaba Cloud ECS
        ssh_key_name = "ssh-increment-meta"
        # The file path of the ssh key which will be saved on local
        ssh_key_local_path = "./ssh-increment-meta-tf.pem"
        # Region in Alibaba Cloud
        region = "cn-qingdao"
        # Prefix for the name of the ECS
        prefix = "tf-sample-"
        # Suffix for the name of the ECS
        suffix = "-incremant-meta"
        ```

3. Create the application on cloud

    1. Run Terraform

        Initialize the Terraform by running the following command:

        ```bash
        terraform init
        ```

        and run the following command to run the script to create the application on [ECS](https://www.alibabacloud.com/help/doc-detail/25367.htm).

        ```bash
        terraform apply
        ```

        You can check the created product on Alibaba Cloud from the following web console url. If you changed region settings in step 2, please change region accordingly.

        *  ECS

            https://ecs.console.aliyun.com/#/server/region/cn-qingdao


    2. Use the tool

        1. Check the IP address from the output of Terraform, and access to it.

        2. Input your credentials to the form and submit it to get images in your bucket.

        3. Check image list and change the properties for each image if you need.

        4. Click incremant.meta file download link at the bottom.


4. After all, run the following command to clean

    This script will destroy the application created on cloud.

    ```bash
    terraform destroy
    ```


## Support

Don't hesitate to [contact us](mailto:projectdelivery@alibabacloud.com) if you have questions or remarks.
