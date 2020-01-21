---
layout: collection-browser-doc
title: Quick start
category: getting-started
excerpt: Learn how to start with Terratest.
tags: ["quick-start"]
order: 101
nav_title: Documentation
nav_title_link: /docs/
---

## Requirements

Terratest uses the Go testing framework. To use Terratest, you need to install:

- [Go](https://golang.org/) (requires version >=1.13)

## Setting up your project

The easiest way to get started with Terratest is to copy one of the examples and its corresponding tests from this
repo. This quick start section uses a Terraform example, but check out the [Examples]({{site.baseurl}}/examples/) section for other
types of infrastructure code you can test (e.g., Packer, Kubernetes, etc).

1. Create an `examples` and `test` folder.

1. Copy all the files from the [basic terraform example]({{site.baseurl}}/examples/code-examples/terraform-basic-example/) into the `examples` folder.

1. Copy the [basic terraform example test]({{site.baseurl}}/examples/tests/terraform-basic-example-test/) into the `test` folder.

1. To configure dependencies, run:

    ```bash
    cd test
    go mod init "<MODULE_NAME>"
    ```

    Where `<MODULE_NAME>` is the name of your module, typically in the format
    `github.com/<YOUR_USERNAME>/<YOUR_REPO_NAME>`.

1. To run the tests:

    ```bash
    cd test
    go test -v -timeout 30m
    ```

    *(See [Timeouts and logging]({{ site.baseurl }}/docs/testing-best-practices/timeouts-and-logging/) for why the `-timeout` parameter is used.)*


## Terratest intro

The basic usage pattern for writing automated tests with Terratest is to:

1. Write tests using Go’s built-in [package testing](https://golang.org/pkg/testing/): you create a file ending in `_test.go` and run tests with the `go test` command. E.g., `go test my_test.go`.
1. Use Terratest to execute your _real_ IaC tools (e.g., Terraform, Packer, etc.) to deploy _real_ infrastructure (e.g., servers) in a _real_ environment (e.g., AWS).
1. Use the tools built into Terratest to validate that the infrastructure works correctly in that environment by making HTTP requests, API calls, SSH connections, etc.
1. Undeploy everything at the end of the test.

To make this sort of testing easier, Terratest provides a variety of helper functions and patterns for common infrastructure testing tasks, such as testing Terraform code, testing Packer templates, testing Docker images, executing commands on servers over SSH, making HTTP requests, working with AWS APIs, and so on.


## Example #1: Terraform
Let’s say you have the following (simplified) [Terraform](https://www.terraform.io/) code to deploy a web server in AWS (if you’re new to Terraform, check out our [Comprehensive Guide to Terraform](https://blog.gruntwork.io/a-comprehensive-guide-to-terraform-b3d32832baca)):

```go
provider "aws" {
  region = "us-east-1"
}
resource "aws_instance" "web_server" {
  ami                    = "ami-43a15f3e" # Ubuntu 16.04
  instance_type          = "t2.micro"
  vpc_security_group_ids = ["${aws_security_group.web_server.id}"]
  # Run a "Hello, World" web server on port 8080
  user_data = <<-EOF
              #!/bin/bash
              echo "Hello, World" > index.html
              nohup busybox httpd -f -p 8080 &
              EOF  
}
# Allow the web app to receive requests on port 8080
resource "aws_security_group" "web_server" {
  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
output "url" {
  value = "http://${aws_instance.web_server.public_ip}:8080"
}
```

The code above deploys an [EC2 Instance](https://aws.amazon.com/ec2/) that is running an Ubuntu [Amazon Machine Image (AMI)](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/AMIs.html). To keep this example simple, we specify a [User Data](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/user-data.html#user-data-api-cli) script that, while the server is booting, fires up a dirt-simple web server that returns “Hello, World” on port 8080.

How can you test this code to be confident it works correctly? Well, let’s think about how you would test it manually:

1. Run `terraform init` and `terraform apply` to deploy into your AWS account.
1. When `apply` finishes, the `url` output variable will show the URL of the web server.
1. Open `url` in your web browser and make sure it says “Hello, World”. It can take 1–2 minutes for the server to boot up, so you may have to retry a few times.
1. When you’re done testing, run `terraform destroy` to clean everything up.

Using Terratest, you can write an automated test that performs the exact same steps! Here’s what the code looks like:

```go
func TestWebServer(t *testing.T) {
  terraformOptions := &terraform.Options {
    // The path to where your Terraform code is located
    TerraformDir: "../web-server",
  }
  // At the end of the test, run `terraform destroy`
  defer terraform.Destroy(t, terraformOptions)
  // Run `terraform init` and `terraform apply`
  terraform.InitAndApply(t, terraformOptions)
  // Run `terraform output` to get the value of an output variable
  url := terraform.Output(t, terraformOptions, "url")
  // Verify that we get back a 200 OK with the expected text. It
  // takes ~1 min for the Instance to boot, so retry a few times.
  status := 200
  text := "Hello, World"
  retries := 15
  sleep := 5 * time.Second
  http_helper.HttpGetWithRetry(t, url, status, text, retries, sleep)
}
```

The code above does all the steps we mentioned above, including running `terraform init`, `terraform apply`, making HTTP requests to the web server (retrying up to 15 times with 5 seconds between retries), and running `terraform destroy` (using [`defer`](https://blog.golang.org/defer-panic-and-recover) to run it at the end of the test, whether the test succeeds or fails). If you put this code in a file called `web_server_test.go`, you can run it by executing `go test`, and you’ll see output that looks like this (truncated for readability):

```bash
$ go test -v
=== RUN   TestWebServer
Running command terraform with args [init]
Initializing provider plugins...
[...]
Terraform has been successfully initialized!
[...]
Running command terraform with args [apply -auto-approve]
aws_instance.web_server: Creating...
  ami:                               "" => "ami-43a15f3e"
  associate_public_ip_address:       "" => "<computed>"
  availability_zone:                 "" => "<computed>"
  ephemeral_block_device.#:          "" => "<computed>"
  instance_type:                     "" => "t2.micro"
  key_name:                          "" => "<computed>"
[...]
Apply complete! Resources: 2 added, 0 changed, 0 destroyed.
Outputs:
url = http://52.67.41.31:8080
[...]
Making an HTTP GET call to URL http://52.67.41.31:8080
dial tcp 52.67.41.31:8080: getsockopt: connection refused.
Sleeping for 5s and will try again.
Making an HTTP GET call to URL http://52.67.41.31:8080
dial tcp 52.67.41.31:8080: getsockopt: connection refused.
Sleeping for 5s and will try again.
Making an HTTP GET call to URL http://52.67.41.31:8080
Success!
[...]
Running command terraform with args [destroy -force -input=false]
[...]
Destroy complete! Resources: 2 destroyed.
--- PASS: TestWebServer (149.36s)
```

Success! Now, every time you make a change to this Terraform code, the test code can run and make sure your web server works as expected.

## Example #2: Packer

The Terraform code in example #1 shoved all the web server code into User Data, which is fine for demonstration and learning purposes, but not what you’d actually do in the real world. For example, let’s say you wanted to run a [Node.js](https://nodejs.org/en/) app, such as the one below in `server.js`, which listens on port 8080 and responds to requests with “Hello, World”:

```js
const http = require('http');
const hostname = '0.0.0.0';
const port = 8080;
const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World!\n');
});
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
```

How can you run this Node.js app on an EC2 Instance? One option is to use [Packer](https://www.packer.io/) to create a custom AMI that has this app installed. Here’s a Packer template that installs Node.js and `server.js` on top of Ubuntu:

```js
{
  "builders": [{
    "ami_name": "node-example-{{isotime | clean_ami_name}}",
    "instance_type": "t2.micro",
    "region": "us-east-1",
    "type": "amazon-ebs",
    "source_ami": "ami-43a15f3e",
    "ssh_username": "ubuntu"
  }],
  "provisioners": [{
    "type": "shell",
    "inline": [
      "curl https://deb.nodesource.com/setup_8.x | sudo -E bash -",
      "sudo apt-get install -y nodejs"
    ]
  },{
    "type": "file",
    "source": "{{template_dir}}/server.js",
    "destination": "/home/ubuntu/server.js"
  }]
}
```

If you put the code above into `web-server.json`, you can create an AMI by running `packer build web-server.json`:

```bash
$ packer build web-server.json
==> amazon-ebs: Prevalidating AMI Name...
==> amazon-ebs: Creating temporary security group for instance...
==> amazon-ebs: Authorizing access to port 22 ...
==> amazon-ebs: Launching a source AWS instance...
[...]
Build 'amazon-ebs' finished.
==> Builds finished. The artifacts of successful builds are:
--> amazon-ebs: AMIs were created:
us-east-1: ami-3505b64a
```

At the end of your build, you get a new AMI ID. Let’s update the Terraform code from example #1 to expose an `ami_id` variable that lets you specify the AMI to deploy and update the User Data script to run the Node.js app:

```js
provider "aws" {
  region = "us-east-1"
}
resource "aws_instance" "web_server" {
  ami                    = "${var.ami_id}"
  instance_type          = "t2.micro"
  vpc_security_group_ids = ["${aws_security_group.web_server.id}"]
  # Run the Node app
  user_data = <<-EOF
              #!/bin/bash
              nohup node /home/ubuntu/server.js &
              EOF  
}
# Allow the web app to receive requests on port 8080
resource "aws_security_group" "web_server" {
  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
variable "ami_id" {
  description = "The ID of the AMI to deploy"
}
output "url" {
  value = "http://${aws_instance.web_server.public_ip}:8080"
}
```

_(Note: the User Data script above is still very simplified. In a real-world use case, you’d probably want to run your Node app with a process supervisor such as `systemd` and configure it to use all cores on the server using the [cluster module](https://nodejs.org/api/cluster.html))._

So how can you test this Packer template and the Terraform code? Well, if you were doing it manually, you’d:

1. Run `packer build` to build a new AMI.
1. Plug the AMI ID into the `ami_id` variable of the Terraform code.
1. Test the Terraform code as before: run `terraform init`, `terraform apply`, open the web server URL in the browser, etc.

Once again, you can automate this process with Terratest! To build the AMI using Packer and pass the ID of that AMI to Terraform as the `ami_id` variable, just add the following to the top of the test code from example #1:

```go
packerOptions := &packer.Options {
    // The path to where the Packer template is located
    Template: "../web-server/web-server.json",
}
// Build the AMI
amiId := packer.BuildAmi(t, packerOptions)
terraformOptions := &terraform.Options {
    // The path to where your Terraform code is located
    TerraformDir: "../web-server",
    // Variables to pass to our Terraform code using -var options
    Vars: map[string]interface{} {
      "ami_id": amiId,
    },
}
```

And that’s it! The rest of the test code is exactly the same. When you run `go test`, Terratest will build your AMI, run `terraform init`, `terraform apply`, make HTTP requests to the web server, etc.

## Give it a shot!

The above is just a small taste of what you can do with [Terratest](https://github.com/gruntwork-io/terratest). To learn more:
1. Check out the [examples]({{site.baseurl}}/examples/) and the corresponding automated tests for those examples for fully working (and tested!) sample code.
1. Browse through the list of [Terratest packages]({{site.baseurl}}/docs/getting-started/packages-overview/) to get a sense of all the tools available in Terratest.
Read our Testing Best Practices Guide.
1. Check out real-world examples of Terratest usage in our open source infrastructure modules: [Consul](https://github.com/hashicorp/terraform-aws-consul), [Vault](https://github.com/hashicorp/terraform-aws-vault), [Nomad](https://github.com/hashicorp/terraform-aws-nomad).

Happy testing!
