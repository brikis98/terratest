---
---
$(document).ready(function () {

  const CODE_LINE_HEIGHT = 15;
  const CODE_BLOCK_PADDING = 16;
  const CODE_POPUPS_CONTENT = {
    "terraform": {
      "example": [
      ],
      "test": [
        {
          "step": 1,
          "line": 0,
          "title": "Introduction",
          "text": loadExampleDescription("terraform")
        },
        {
          "step": 2,
          "line": 9,
          "title": "Configure",
          "text": "Set the path to the Terraform code that will be tested."
        },
        {
          "step": 5,
          "line": 20,
          "title": "Clean up",
          "text": 'Clean up resources with "terraform destroy". Using "defer" runs the command at the end of the test, whether the test succeeds or fails.'
        },
        {
          "step": 3,
          "line": 24,
          "title": "Run",
          "text": 'Run "terraform init" and "terraform apply".'
        },
        {
          "step": 4,
          "line": 30,
          "title": "Validate",
          "text": "Check the output against expected values."
        },
      ]
    },
    "packer": {
      "example": [
      ],
      "test": [
        {
          "step": 1,
          "line": 0,
          "title": "Introduction",
          "text": loadExampleDescription("packer")
        },
        {
          "step": 2,
          "line": 13,
          "title": "Configure",
          "text": "Read Packer's template and set AWS Region variable."
        },
        {
          "step": 3,
          "line": 26,
          "title": "Run",
          "text": "Build artifacts from Packer's template."
        },
        {
          "step": 5,
          "line": 29,
          "title": "Clean up",
          "text": "Remove AMI after test."
        },
        {
          "step": 4,
          "line": 34,
          "title": "Validate",
          "text": "Check AMI's properties."
        },
      ]
    },
    "docker": {
      "example": [
      ],
      "test": [
        {
          "step": 1,
          "line": 0,
          "title": "Introduction",
          "text": loadExampleDescription("docker")
        },
        {
          "step": 2,
          "line": 10,
          "title": "Configure Packer",
          "text": "Configure Packer to build Docker image."
        },
        {
          "step": 3,
          "line": 18,
          "title": "Run Packer",
          "text": "Build Docker image using Packer."
        },
        {
          "step": 4,
          "line": 23,
          "title": "Configure Docker",
          "text": "Set path to 'docker-compose.yml' and environment variables to run Docker image."
        },
        {
          "step": 7,
          "line": 36,
          "title": "Clean up",
          "text": "Shut down Docker container after tests."
        },
        {
          "step": 5,
          "line": 40,
          "title": "Run Docker",
          "text": "Run Docker container."
        },
        {
          "step": 6,
          "line": 51,
          "title": "Validate",
          "text": "Check if the web app returns 200."
        },
      ]
    },
    "kubernetes": {
      "example": [
      ],
      "test": [
        {
          "step": 1,
          "line": 0,
          "title": "Introduction",
          "text": loadExampleDescription("kubernetes")
        },
        {
          "step": 2,
          "line": 12,
          "title": "Configure (1)",
          "text": "Set path to the Kubernetes minimal resource config file."
        },
        {
          "step": 3,
          "line": 25,
          "title": "Configure (2)",
          "text": "Set up the kubectl."
        },
        {
          "step": 6,
          "line": 30,
          "title": "Clean up (1)",
          "text": "Delete Namespace."
        },
        {
          "step": 7,
          "line": 33,
          "title": "Clean up (2)",
          "text": "Remove kubectl."
        },
        {
          "step": 4,
          "line": 37,
          "title": "Run",
          "text": "Apply kubectl with 'kubectl apply -f RESOURCE_CONFIG' command."
        },
        {
          "step": 5,
          "line": 42,
          "title": "Validate",
          "text": "Check if NGINX service was deployed successfully."
        },
      ]
    },
    "aws": {
      "example": [
      ],
      "test": [
        {
          "step": 1,
          "line": 0,
          "title": "Introduction",
          "text": loadExampleDescription("aws")
        },
        {
          "step": 2,
          "line": 18,
          "title": "Configure",
          "text": "Configure Terraform setting path to Terraform code, EC2 instance name, and AWS Region."
        },
        {
          "step": 5,
          "line": 33,
          "title": "Clean up",
          "text": 'Clean up resources with "terraform destroy". Using "defer" runs the command at the end of the test, whether the test succeeds or fails.'
        },
        {
          "step": 3,
          "line": 38,
          "title": "Run",
          "text": 'Run "terraform init" and "terraform apply".'
        },
        {
          "step": 4,
          "line": 54,
          "title": "Validate",
          "text": "Check if the EC2 instance with a given name is set."
        },
      ]
    },
    "gcp": {
      "example": [
      ],
      "test": [
        {
          "step": 1,
          "line": 0,
          "title": "Introduction",
          "text": loadExampleDescription("gcp")
        },
        {
          "step": 2,
          "line": 28,
          "title": "Configure",
          "text": "Configure Terraform setting path to Terraform code, bucket name, and instance name."
        },
        {
          "step": 5,
          "line": 38,
          "title": "Clean up",
          "text": 'Clean up resources with "terraform destroy". Using "defer" runs the command at the end of the test, whether the test succeeds or fails.'
        },
        {
          "step": 3,
          "line": 42,
          "title": "Run",
          "text": 'Run "terraform init" and "terraform apply".'
        },
        {
          "step": 4.1,
          "line": 49,
          "title": "Validate Bucket",
          "text": "Check if the Bucket's URL is as excpected."
        },
        {
          "step": 4.2,
          "line": 61,
          "title": "Validate Instance",
          "text": "Check if the GCP instance contains a given tag."
        },
      ]
    },
    "azure": {
      "example": [
      ],
      "test": [
        {
          "step": 1,
          "line": 0,
          "title": "Introduction",
          "text": loadExampleDescription("azure")
        },
        {
          "step": 2,
          "line": 12,
          "title": "Configure",
          "text": "Configure Terraform setting up a path to Terraform code."
        },
        {
          "step": 5,
          "line": 18,
          "title": "Clean up",
          "text": 'Clean up resources with "terraform destroy". Using "defer" runs the command at the end of the test, whether the test succeeds or fails.'
        },
        {
          "step": 3,
          "line": 21,
          "title": "Run",
          "text": 'Run "terraform init" and "terraform apply".'
        },
        {
          "step": 4,
          "line": 30,
          "title": "Validate",
          "text": "Check the size of the Virtual Machine."
        }
      ]
    }
  }

  // Set up initial popups and open first one (introduction)
  updatePopups()
  openPopup($('.test-with-terratest__block.active').data('target'), 1)

  // Open example when user clicks on tab
  $('.navs .test-with-terratest__nav-item').on('click', function() {
    openExample($(this).data('target'))
  })

  // Open example and scroll to test-with-terratest section when user clicks on
  // tech in the header
  $('.link-to-test-with-terratest').on('click', function() {
    openExample($(this).data('target'))
    scrollToTests()
  })

  // Switch between code snippets (example & test)
  $('.test-with-terratest__tabs .tab').on('click', function() {
    $(this).parents('.test-with-terratest__tabs').find('.tab').removeClass('active')
    $(this).addClass('active')

    $(this).parents('.test-with-terratest__block').find('.test-with-terratest__code').removeClass('active')
    $($(this).data('target')).addClass('active')

    updatePopups()
    openPopup($('.test-with-terratest__block.active').data('target'), 1)
  })

  // Open dropdown of technologies to select
  $('.test-with-terratest__nav .nav-dropdown-btn, .test-with-terratest__nav .current-nav').on('click', function() {
    $('.test-with-terratest__nav .navs').toggleClass('active')
  })

  // Open popup when user click on circle with the number
  $('.index-page__test-with-terratest').on('click', '.code-popup-handler', function() {
    const isActive = $(this).hasClass('active')
    $('.code-popup-handler').removeClass('active')
    if (!isActive) {
      $(this).addClass('active')
    }
  })

  function scrollToTests() {
    $([document.documentElement, document.body]).animate({
        scrollTop: $('#index-page__test-with-terratest').offset().top
    }, 500)
  }

  function openExample(target) {
    // Change active tab in navigation
    $('.test-with-terratest__nav-item').removeClass('active')
    const jTarget = $('.navs .test-with-terratest__nav-item[data-target="'+target+'"]')
    jTarget.addClass('active')

    // Change the block below navigation (with code snippets)
    $('.test-with-terratest__block').removeClass('active')
    $('#twt__block-' + target).addClass('active')

    $('.test-with-terratest__nav .navs').removeClass('active')
    $('.test-with-terratest__nav .current-nav').html(jTarget.html())

    updatePopups()
    openPopup(target, 1)
  }

  function updatePopups() {
    $('.code-popup-handler').remove()

    const activeCode = $('.test-with-terratest__block.active .test-with-terratest__code.active')
    const target = activeCode.data('target')
    const codeType = activeCode.data('type') // example or test

    CODE_POPUPS_CONTENT[target][codeType].forEach(function(v,k) {
      const top = (CODE_LINE_HEIGHT * v.line) + CODE_BLOCK_PADDING;
      const elToAppend =
        '<div class="code-popup-handler" style="top: '+top+'px" data-step="'+v.step+'">' +
          v.step +
          '<div class="shadow-bg-1"></div><div class="shadow-bg-2"></div>' +
          '<div class="popup">' +
            '<div class="left-border"></div>' +
            '<div class="content">' +
              '<span class="title">' + v.title + '</span>' +
              '<p class="text">' + v.text + '</p>' +
            '</div>' +
        '</div>'
      const code = $("#twt__code-"+target+"-"+codeType)
      code.append(elToAppend)
    })
  }

  function openPopup(techName, step) {
    $('.code-popup-handler').removeClass('active')
    $('#twt__block-'+techName).find('.code-popup-handler[data-step="'+step+'"]').addClass('active')
  }

  function loadExampleDescription(name) {
    return $('#index-page__test-with-terratest').find('#twt__block-'+name+' .description').html()
  }

})
