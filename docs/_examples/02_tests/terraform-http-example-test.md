---
layout: collection-browser-doc
title: Terraform HTTP example test
category: tests
excerpt: >-
  The test written in GoLang for "Terraform HTTP Example".
tags: ["example"]
image: /assets/img/logos/terraform-logo.png
order: 201
nav_title: Examples
nav_title_link: /examples/
---

Full soure code can be found here: [terraform_http_example_test.go](https://github.com/gruntwork-io/terratest/blob/master/test/terraform_http_example_test.go).


This test fits to the [Terraform HTTP Example]({{site.baseurl}}/examples/code-examples/terraform-http-example/).

## Source code

```go
package test

import (
	"crypto/tls"
	"fmt"
	"testing"
	"time"

	"github.com/gruntwork-io/terratest/modules/aws"
	http_helper "github.com/gruntwork-io/terratest/modules/http-helper"
	"github.com/gruntwork-io/terratest/modules/random"
	"github.com/gruntwork-io/terratest/modules/terraform"
)

// An example of how to test the Terraform module in examples/terraform-http-example using Terratest.
func TestTerraformHttpExample(t *testing.T) {
	t.Parallel()

	// A unique ID we can use to namespace resources so we don't clash with anything already in the AWS account or
	// tests running in parallel
	uniqueID := random.UniqueId()

	// Give this EC2 Instance and other resources in the Terraform code a name with a unique ID so it doesn't clash
	// with anything else in the AWS account.
	instanceName := fmt.Sprintf("terratest-http-example-%s", uniqueID)

	// Specify the text the EC2 Instance will return when we make HTTP requests to it.
	instanceText := fmt.Sprintf("Hello, %s!", uniqueID)

	// Pick a random AWS region to test in. This helps ensure your code works in all regions.
	awsRegion := aws.GetRandomStableRegion(t, nil, nil)

	terraformOptions := &terraform.Options{
		// The path to where our Terraform code is located
		TerraformDir: "../examples/terraform-http-example",

		// Variables to pass to our Terraform code using -var options
		Vars: map[string]interface{}{
			"aws_region":    awsRegion,
			"instance_name": instanceName,
			"instance_text": instanceText,
		},
	}

	// At the end of the test, run `terraform destroy` to clean up any resources that were created
	defer terraform.Destroy(t, terraformOptions)

	// This will run `terraform init` and `terraform apply` and fail the test if there are any errors
	terraform.InitAndApply(t, terraformOptions)

	// Run `terraform output` to get the value of an output variable
	instanceURL := terraform.Output(t, terraformOptions, "instance_url")

	// Setup a TLS configuration to submit with the helper, a blank struct is acceptable
	tlsConfig := tls.Config{}

	// It can take a minute or so for the Instance to boot up, so retry a few times
	maxRetries := 30
	timeBetweenRetries := 5 * time.Second

	// Verify that we get back a 200 OK with the expected instanceText
	http_helper.HttpGetWithRetry(t, instanceURL, &tlsConfig, 200, instanceText, maxRetries, timeBetweenRetries)
}
```

## Step-by-step explanation

### 1. AWS variables

First, define variables that will be used to set up AWS infrastructure with Terraform code:

```go
// A unique ID we can use to namespace resources so we don't clash with anything already in the AWS account or
// tests running in parallel
uniqueID := random.UniqueId()

// Give this EC2 Instance and other resources in the Terraform code a name with a unique ID so it doesn't clash
// with anything else in the AWS account.
instanceName := fmt.Sprintf("terratest-http-example-%s", uniqueID)

// Specify the text the EC2 Instance will return when we make HTTP requests to it.
instanceText := fmt.Sprintf("Hello, %s!", uniqueID)

// Pick a random AWS region to test in. This helps ensure your code works in all regions.
awsRegion := aws.GetRandomStableRegion(t, nil, nil)
```

### 2. Terraform setup

Set up Terraform code with `terraformOptions`:

```go
terraformOptions := &terraform.Options{
	// The path to where our Terraform code is located
	TerraformDir: "../examples/terraform-http-example",

	// Variables to pass to our Terraform code using -var options
	Vars: map[string]interface{}{
		"aws_region":    awsRegion,
		"instance_name": instanceName,
		"instance_text": instanceText,
	},
}
```

### 3. Infrastructure initialization

Next, initialize and deploy Terraform code. Following code runs `terraform init` and `terraform deploy`:

```go
terraform.InitAndApply(t, terraformOptions)
```

### 4. Validation

Run `terraform output` to get the value of an output variable:

```go
instanceURL := terraform.Output(t, terraformOptions, "instance_url")
```

Setup a TLS configuration to submit with the helper, a blank struct is acceptable:
```go
tlsConfig := tls.Config{}
```

It can take a minute or so for the Instance to boot up, so retry a few times:
```go
maxRetries := 30
timeBetweenRetries := 5 * time.Second
```

Verify that we get back a 200 OK with the expected instanceText:
```go
http_helper.HttpGetWithRetry(t, instanceURL, &tlsConfig, 200, instanceText, maxRetries, timeBetweenRetries)
```

### 5. Clean

Finally, clean up any resources that were created:

```go
defer terraform.Destroy(t, terraformOptions)
```
