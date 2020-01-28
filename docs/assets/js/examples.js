---
---
$(document).ready(function () {

  const DEFAULT_EXAMPLE_ID = 'terraform'
  const CODE_LINE_HEIGHT = 15
  const CODE_BLOCK_PADDING = 16
  window.examples = {
    tags: {}
  }

  // Activate first example
  openExample(DEFAULT_EXAMPLE_ID)

  // Open example when user clicks on tab
  $('.navs .examples__nav-item').on('click', function() {
    openExample($(this).data('id'))
  })

  // Open example and scroll to examples section when user clicks on
  // tech in the header
  $('.link-to-examples').on('click', function() {
    openExample($(this).data('target'))
    scrollToTests()
  })

  // Switch between code snippets (files)
  $('.examples__tabs .tab').on('click', function() {
    $(this).parents('.examples__tabs').find('.tab').removeClass('active')
    $(this).addClass('active')

    $(this).parents('.examples__block').find('.examples__code').removeClass('active')
    $($(this).data('target')).addClass('active')

    loadCodeSnippet()
  })

  // Open dropdown of technologies to select
  $('.examples__nav .nav-dropdown-btn, .examples__nav .current-nav').on('click', function() {
    $('.examples__nav .navs').toggleClass('active')
  })

  // Open popup when user click on circle with the number
  $('.index-page__examples').on('click', '.code-popup-handler', function() {
    const isActive = $(this).hasClass('active')
    $('.code-popup-handler').removeClass('active')
    if (!isActive) {
      $(this).addClass('active')
    }
  })

  function scrollToTests() {
    $([document.documentElement, document.body]).animate({
        scrollTop: $('#index-page__examples').offset().top
    }, 500)
  }

  function openExample(target) {
    // Change active tab in navigation
    $('.examples__nav-item').removeClass('active')
    const jTarget = $('.navs .examples__nav-item[data-id="'+target+'"]')
    jTarget.addClass('active')

    // Change the block below navigation (with code snippets)
    $('.examples__block').removeClass('active')
    $('#example__block-' + target).addClass('active')

    // Set current tab
    $('.examples__nav .navs').removeClass('active')
    $('.examples__nav .current-nav').html(jTarget.html())

    loadCodeSnippet()
  }

  function loadCodeSnippet() {
    console.log('x1', $('.examples__block.active .examples__code.active'))
    $('.examples__block.active .examples__code.active').each(async function (i, activeCodeSnippet) {
      console.log('x2')
      const $activeCodeSnippet = $(activeCodeSnippet)
      const exampleTarget = $(this).data('example')
      const fileId = $(this).data('target')
      if (!$activeCodeSnippet.data('loaded')) {
        const response = await fetch($activeCodeSnippet.data('url'))
        const json = await response.json()
        $activeCodeSnippet.attr('data-loaded', true)
        const content = atob(json.content)
        findTags(content, exampleTarget, fileId)
        $activeCodeSnippet.find('code').html(content)
        Prism.highlightAll()
      }
      updatePopups()
      openPopup(exampleTarget, 1)
    })
  }

  function findTags(content, exampleTarget, fileId) {
    let tags = []
    let regexpTags =  /data "(\w+)" "(\w+)" {/mg
    let match = regexpTags.exec(content)
    do {
      console.log(`Hello ${match[1]}`)
      tags.push({
        text: match[0],
        tag: match[1],
        step: 0,
        line: findLineNumber(content, match[0])
      })
    } while((match = regexpTags.exec(content)) !== null)
    window.examples.tags[exampleTarget] = {
      ...window.examples.tags[exampleTarget],
      [fileId]: tags
    }
  }

  function findLineNumber(content, text) {
    let tagIndex = content.indexOf(text)
    var tempString = content.substring(0, tagIndex)
    var lineNumber = tempString.split('\n').length
    return lineNumber
  }

  function updatePopups() {
    $('.code-popup-handler').remove()
    const activeCode = $('.examples__block.active .examples__code.active')
    const exampleTarget = activeCode.data('example')
    const fileId = activeCode.data('target')

    console.log('tags', exampleTarget, fileId, window.examples.tags)
    console.log('tags2', window.examples.tags[exampleTarget][fileId])

    window.examples.tags[exampleTarget][fileId].map( function(v,k) {
      const top = (CODE_LINE_HEIGHT * v.line) + CODE_BLOCK_PADDING;
      const elToAppend =
        '<div class="code-popup-handler" style="top: '+top+'px" data-step="'+v.step+'">' +
          v.step +
          '<div class="shadow-bg-1"></div><div class="shadow-bg-2"></div>' +
          '<div class="popup">' +
            '<div class="left-border"></div>' +
            '<div class="content">' +
              '<p class="text">' + v.text + '</p>' +
            '</div>' +
        '</div>'
      const code = $("#example__code-"+exampleTarget+"-"+fileId)
      code.append(elToAppend)
    })

    openPopup(exampleTarget, 0)
  }

  function openPopup(techName, step) {
    $('.code-popup-handler').removeClass('active')
    $('#example__block-'+techName).find('.code-popup-handler[data-step="'+step+'"]').addClass('active')
  }

  function loadExampleDescription(name) {
    return $('#index-page__examples').find('#example__block-'+name+' .description').html()
  }

})
