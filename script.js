const sendMessageURL = "https://personal-354720.uw.r.appspot.com/send_message"

$(document).ready(() => {




  // TIMELINE FUNCTIONALITY
  ;(function () {
    // timeline views
    const t1 = $("#timeline_label_holder_1"),
      t2 = $("#timeline_label_holder_2"),
      t3 = $("#timeline_label_holder_3")

    const s1 = t1.children(".timeline_summary"),
      s2 = t2.children(".timeline_summary"),
      s3 = t3.children(".timeline_summary")

    const i1 = t1.children(".timeline_span").children(".timeline_label_icon"),
      i2 = t2.children(".timeline_span").children(".timeline_label_icon"),
      i3 = t3.children(".timeline_span").children(".timeline_label_icon")

    let currentDisplay = null;

    // timeline click functionality
    function displayS1 () {
      t1.css("margin-top", 100)
      s1.css("visibility", "visible")
      s1.css("max-height", "300px")
      i1.prop("src", "static/minus_icon.svg")
    }
    function hideS1 () {
      t1.css("margin-top", 140)
      s1.css("visibility", "hidden")
      s1.css("max-height", "0px")
      i1.prop("src", "static/plus_icon.svg")
    }

    function displayS2 () {
      t2.css("margin-top", 0)
      s2.css("visibility", "visible")
      s2.css("max-height", "300px")
      i2.prop("src", "static/minus_icon.svg")
    }
    function hideS2 () {
      t2.css("margin-top", 20)
      s2.css("visibility", "hidden")
      s2.css("max-height", "0px")
      i2.prop("src", "static/plus_icon.svg")
    }

    function displayS3 () {
      t3.css("margin-top", 0)
      s3.css("visibility", "visible")
      s3.css("max-height", "300px")
      i3.prop("src", "static/minus_icon.svg")
    }
    function hideS3 () {
      t3.css("margin-top", 3)
      s3.css("visibility", "hidden")
      s3.css("max-height", "0px")
      i3.prop("src", "static/plus_icon.svg")
    }

    function toggleS1 () {
      if (currentDisplay === 1) {
        hideS1()
        currentDisplay = null
      } else {
        if (currentDisplay === 2) hideS2()
        else if (currentDisplay === 3) hideS3()
        currentDisplay = 1
        displayS1()
      }
    }

    function toggleS2 () {
      if (currentDisplay === 2) {
        hideS2()
        currentDisplay = null
      } else {
        if (currentDisplay === 1) hideS1()
        else if (currentDisplay === 3) hideS3()
        currentDisplay = 2
        displayS2()
      }
    }

    function toggleS3 () {
      if (currentDisplay === 3) {
        hideS3()
        currentDisplay = null
      } else {
        if (currentDisplay === 1) hideS1()
        else if (currentDisplay === 2) hideS2()
        currentDisplay = 3
        displayS3()
      }

    }

    // set functionality
    $("#timeline_label_holder_1").click(toggleS1)
    $("#timeline_label_holder_2").click(toggleS2)
    $("#timeline_label_holder_3").click(toggleS3)

    $(".fill_color_1").click(toggleS1)
    $(".stroke_color_1").click(toggleS1)
    $(".fill_color_2").click(toggleS2)
    $(".stroke_color_2").click(toggleS2)
    $(".fill_color_3").click(toggleS3)
    $(".stroke_color_3").click(toggleS3)
  })()






  // PROJECTS LIST FUNTIONALITY
  ;(function() {
    const holder = $("#projects_content_holder")

    const display = $("#project_display")
    const visDisplay = $("#project_vis"),
      dynoDisplay = $("#project_dyno"),
      voltammetryDisplay = $("#project_voltammetry")

    function showDisplay() {
      display.show()
      visDisplay.hide()
      dynoDisplay.hide()
      voltammetryDisplay.hide()

      holder[0].scrollIntoView()
    }

    // add functionality
    $(".project_back").click(showDisplay)
    $("#project_vis_display").click(() => {
      visDisplay.show()
      display.hide()
      dynoDisplay.hide()
      voltammetryDisplay.hide()

      holder[0].scrollIntoView()
    })
    $("#project_dyno_display").click(() => {
      display.hide()
      visDisplay.hide()
      dynoDisplay.show()
      voltammetryDisplay.hide()

      holder[0].scrollIntoView()
    })
    $("#project_voltammetry_display").click(() => {
      display.hide()
      visDisplay.hide()
      dynoDisplay.hide()
      voltammetryDisplay.show()

      holder[0].scrollIntoView()
    })

    // initialize
    display.show()
    visDisplay.hide()
    dynoDisplay.hide()
    voltammetryDisplay.hide()
  })()













  // CONTACT FUNCTIONALITY
  ;(function() {
    const messageBox = $("#message")
    const messageButton = $("#send_message")
    const successDisplay = $("#message_success"),
      errorDisplay = $("#message_error"),
      waitingDisplay = $("#message_waiting")


    messageButton.click(() => {
      const message = messageBox.text()

      // TESTING
      if (message === "TEST: ERROR"){
        successDisplay.hide()
        errorDisplay.show()
        waitingDisplay.hide()
      } else if (message === "TEST: SUCCESS") {
        successDisplay.show()
        errorDisplay.hide()
        waitingDisplay.hide()
      } else if (message === "TEST: WAITING") {
        successDisplay.hide()
        errorDisplay.hide()
        waitingDisplay.show()
      } else if (message !== "") {
        // send message
        successDisplay.hide()
        errorDisplay.hide()
        waitingDisplay.show()
        messageButton.hide()
        //messageBox.text("")

        const data = {
          message: message
        }


        //fetch(`${sendMessageURL}?message=${encodeURIComponent(message)}`)
        fetch(sendMessageURL, {
          method: 'POST', // *GET, POST, PUT, DELETE, etc.
          /*mode: 'cors', // no-cors, *cors, same-origin
          cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
          credentials: 'same-origin', // include, *same-origin, omit
          */headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
          },/*
          redirect: 'follow', // manual, *follow, error
          referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
          */
          body: JSON.stringify(data) // body data type must match "Content-Type" header
        }).then(response => {
          if (response.status === 200 || response.status === 201 || response.status === 202) {
            // message successful
            successDisplay.show()
            errorDisplay.hide()
            waitingDisplay.hide()
          } else {
            // error
            successDisplay.hide()
            errorDisplay.show()
            waitingDisplay.hide()
          }
        }).catch(() => {
          // error
          successDisplay.hide()
          errorDisplay.show()
          waitingDisplay.hide()
        }).finally(() => {
          messageButton.show()
        })
      }
    })
  })()
})
