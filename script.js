const sendMessageURL = "https://personal-354720.uw.r.appspot.com/send_message"

function onDocumentReady(callback) {
  if (document.readyState !== 'loading') callback()
  else document.addEventListener('DOMContentLoaded', callback)
}

onDocumentReady(() => {
  // TIMELINE FUNCTIONALITY
  ;(function () {
    // timeline views
    const t1 = document.getElementById("timeline_label_holder_1"),
      t2 = document.getElementById("timeline_label_holder_2"),
      t3 = document.getElementById("timeline_label_holder_3"),
      t4 = document.getElementById("timeline_label_holder_4")

    const s1 = t1.querySelector(".timeline_summary"),
      s2 = t2.querySelector(".timeline_summary"),
      s3 = t3.querySelector(".timeline_summary"),
      s4 = t4.querySelector(".timeline_summary")

    const i1 = t1.querySelector(".timeline_span").querySelector(".timeline_label_icon"),
      i2 = t2.querySelector(".timeline_span").querySelector(".timeline_label_icon"),
      i3 = t3.querySelector(".timeline_span").querySelector(".timeline_label_icon"),
      i4 = t4.querySelector(".timeline_span").querySelector(".timeline_label_icon")

    let currentDisplay = null;

    // timeline click functionality
    function displayS1 () {
      t1.style.marginTop = "20px"
      s1.style.visibility = "visible"
      s1.style.maxHeight = "300px"
      i1.src = "static/minus_icon.svg"
    }
    function hideS1 () {
      t1.style.marginTop = "60px"
      s1.style.visibility = "hidden"
      s1.style.maxHeight = "0px"
      i1.src = "static/plus_icon.svg"
    }

    function displayS2 () {
      t2.style.marginTop = "0px"
      s2.style.visibility = "visible"
      s2.style.maxHeight = "300px"
      i2.src = "static/minus_icon.svg"
    }
    function hideS2 () {
      t2.style.marginTop = "20px"
      s2.style.visibility = "hidden"
      s2.style.maxHeight = "0px"
      i2.src = "static/plus_icon.svg"
    }

    function displayS3 () {
      t3.style.marginTop = "0px"
      s3.style.visibility = "visible"
      s3.style.maxHeight = "300px"
      i3.src = "static/minus_icon.svg"
    }
    function hideS3 () {
      t3.style.marginTop = "20px"
      s3.style.visibility = "hidden"
      s3.style.maxHeight = "0px"
      i3.src = "static/plus_icon.svg"
    }

    function displayS4 () {
      t4.style.marginTop = "0px"
      s4.style.visibility = "visible"
      s4.style.maxHeight = "300px"
      i4.src = "static/minus_icon.svg"
    }
    function hideS4 () {
      t4.style.marginTop = "20px"
      s4.style.visibility = "hidden"
      s4.style.maxHeight = "0px"
      i4.src = "static/plus_icon.svg"
    }

    function toggleS1 () {
      if (currentDisplay === 1) {
        hideS1()
        currentDisplay = null
      } else {
        if (currentDisplay === 2) hideS2()
        else if (currentDisplay === 3) hideS3()
        else if (currentDisplay === 4) hideS4()
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
        else if (currentDisplay === 4) hideS4()
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
        else if (currentDisplay === 4) hideS4()
        currentDisplay = 3
        displayS3()
      }
    }

    function toggleS4 () {
      if (currentDisplay === 4) {
        hideS4()
        currentDisplay = null
      } else {
        if (currentDisplay === 1) hideS1()
        else if (currentDisplay === 2) hideS2()
        else if (currentDisplay === 3) hideS3()
        currentDisplay = 4
        displayS4()
      }
    }

    // set functionality
    t1.addEventListener('click', toggleS1)
    t2.addEventListener('click', toggleS2)
    t3.addEventListener('click', toggleS3)
    t4.addEventListener('click', toggleS4)

    document.querySelectorAll(".fill_color_1").forEach(e => e.addEventListener('click', toggleS1))
    document.querySelectorAll(".stroke_color_1").forEach(e => e.addEventListener('click', toggleS1))
    document.querySelectorAll(".fill_color_2").forEach(e => e.addEventListener('click', toggleS2))
    document.querySelectorAll(".stroke_color_2").forEach(e => e.addEventListener('click', toggleS2))
    document.querySelectorAll(".fill_color_3").forEach(e => e.addEventListener('click', toggleS3))
    document.querySelectorAll(".stroke_color_3").forEach(e => e.addEventListener('click', toggleS3))
    document.querySelectorAll(".fill_color_4").forEach(e => e.addEventListener('click', toggleS4))
    document.querySelectorAll(".stroke_color_4").forEach(e => e.addEventListener('click', toggleS4))
  })()






  // PROJECTS LIST FUNTIONALITY
  ;(function() {
    const holder = document.getElementById("projects_content_holder")

    const display = document.getElementById("project_display")
    const visDisplay = document.getElementById("project_vis"),
      dynoDisplay = document.getElementById("project_dyno"),
      voltammetryDisplay = document.getElementById("project_voltammetry")

    function showDisplay() {
      display.style.display = ''
      visDisplay.style.display = 'none'
      dynoDisplay.style.display = 'none'
      voltammetryDisplay.style.display = 'none'

      holder.scrollIntoView()
    }

    // add functionality
    document.querySelectorAll(".project_back").forEach(e => e.addEventListener("click", showDisplay))
    document.getElementById("project_vis_display").addEventListener("click", () => {
      visDisplay.style.display = ''
      display.style.display = 'none'
      dynoDisplay.style.display = 'none'
      voltammetryDisplay.style.display = 'none'

      holder.scrollIntoView()
    })
    document.getElementById("project_dyno_display").addEventListener("click", () => {
      display.style.display = 'none'
      visDisplay.style.display = 'none'
      dynoDisplay.style.display = ''
      voltammetryDisplay.style.display = 'none'

      holder.scrollIntoView()
    })
    document.getElementById("project_voltammetry_display").addEventListener("click", () => {
      display.style.display = 'none'
      visDisplay.style.display = 'none'
      dynoDisplay.style.display = 'none'
      voltammetryDisplay.style.display = ''

      holder.scrollIntoView()
    })

    // initialize
    display.style.display = ''
    visDisplay.style.display = 'none'
    dynoDisplay.style.display = 'none'
    voltammetryDisplay.style.display = 'none'
  })()













  // CONTACT FUNCTIONALITY
  ;(function() {
    const messageBox = document.getElementById("message")
    const messageButton = document.getElementById("send_message")
    const successDisplay = document.getElementById("message_success"),
      errorDisplay = document.getElementById("message_error"),
      waitingDisplay = document.getElementById("message_waiting")


    messageButton.addEventListener("click", () => {
      const message = messageBox.textContent

      // TESTING
      if (message === "TEST: ERROR"){
        successDisplay.style.display = 'none'
        errorDisplay.style.display = 'block'
        waitingDisplay.style.display = 'none'
      } else if (message === "TEST: SUCCESS") {
        successDisplay.style.display = 'block'
        errorDisplay.style.display = 'none'
        waitingDisplay.style.display = 'none'
      } else if (message === "TEST: WAITING") {
        successDisplay.style.display = 'none'
        errorDisplay.style.display = 'none'
        waitingDisplay.style.display = 'block'
      } else if (message !== "") {
        // send message
        successDisplay.style.display = 'none'
        errorDisplay.style.display = 'none'
        waitingDisplay.style.display = 'block'
        messageButton.style.display = 'none'
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
            successDisplay.style.display = 'block'
            errorDisplay.style.display = 'none'
            waitingDisplay.style.display = 'none'
          } else {
            // error
            successDisplay.style.display = 'none'
            errorDisplay.style.display = 'block'
            waitingDisplay.style.display = 'none'
          }
        }).catch(() => {
          // error
          successDisplay.style.display = 'none'
          errorDisplay.style.display = 'block'
          waitingDisplay.style.display = 'none'
        }).finally(() => {
          messageButton.style.display = 'block'
        })
      }
    })
  })()
})
