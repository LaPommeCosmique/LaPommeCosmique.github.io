const sendMessageURL = "https://personal-354720.uw.r.appspot.com/send_message"

function onDocumentReady(callback) {
  if (document.readyState !== 'loading') callback()
  else document.addEventListener('DOMContentLoaded', callback)
}

onDocumentReady(() => {
  // TIMELINE FUNCTIONALITY
  ;(function () {
    // timeline views
    const timeline_components = [
      document.getElementById("timeline_label_holder_1"),
      document.getElementById("timeline_label_holder_2"),
      document.getElementById("timeline_label_holder_3"),
      document.getElementById("timeline_label_holder_4")
    ]

    let currentDisplayComponent = null;

    // timeline click functionality
    function showSummary (timeline_component) {
      const summary = timeline_component.querySelector(".timeline_summary")
      summary.style.visibility = "visible"
      summary.style.maxHeight = "300px"
      const icon = timeline_component.querySelector(".timeline_label_icon_holder").querySelector(".timeline_label_icon")
      icon.src = "static/minus_icon.svg"
      const icon_label = timeline_component.querySelector(".timeline_label_icon_holder").querySelector(".timeline_label_icon_label")
      icon_label.textContent = "see less"
    }
    function hideSummary (timeline_component) {
      const summary = timeline_component.querySelector(".timeline_summary")
      summary.style.visibility = "hidden"
      summary.style.maxHeight = "0px"
      const icon = timeline_component.querySelector(".timeline_label_icon_holder").querySelector(".timeline_label_icon")
      icon.src = "static/plus_icon.svg"
      const icon_label = timeline_component.querySelector(".timeline_label_icon_holder").querySelector(".timeline_label_icon_label")
      icon_label.textContent = "see more"
    }

    function toggleSummary(component) {
      if (currentDisplayComponent === component) {
        hideSummary(timeline_components[currentDisplayComponent])
        currentDisplayComponent = null
      } else {
        if (currentDisplayComponent !== null) hideSummary(timeline_components[currentDisplayComponent])
        showSummary(timeline_components[component])
        currentDisplayComponent = component
      }
    }

    // set functionality
    timeline_components.forEach((c, i) => c.addEventListener("click", () => toggleSummary(i)))
    
    // toggle if line/dot in timeline is pressed
    timeline_components.forEach((c, i) => {
      document.querySelectorAll(".fill_color_"+(i+1)).forEach(e => e.addEventListener('click', () => toggleSummary(i)))
      document.querySelectorAll(".stroke_color_"+(i+1)).forEach(e => e.addEventListener('click', () => toggleSummary(i)))
    })
  })()






  // PROJECTS LIST FUNTIONALITY
  ;(function() {
    const holder = document.getElementById("projects_content_holder")

    const display = document.getElementById("project_display")
    const visDisplay = document.getElementById("project_1"),
      dynoDisplay = document.getElementById("project_2"),
      voltammetryDisplay = document.getElementById("project_3")

    function showDisplay() {
      display.style.display = ''
      visDisplay.style.display = 'none'
      dynoDisplay.style.display = 'none'
      voltammetryDisplay.style.display = 'none'

      holder.scrollIntoView()
    }

    // add functionality
    document.querySelectorAll(".project_back").forEach(e => e.addEventListener("click", showDisplay))
    document.getElementById("project_1_display").addEventListener("click", () => {
      visDisplay.style.display = ''
      display.style.display = 'none'
      dynoDisplay.style.display = 'none'
      voltammetryDisplay.style.display = 'none'

      holder.scrollIntoView()
    })
    document.getElementById("project_2_display").addEventListener("click", () => {
      display.style.display = 'none'
      visDisplay.style.display = 'none'
      dynoDisplay.style.display = ''
      voltammetryDisplay.style.display = 'none'

      holder.scrollIntoView()
    })
    document.getElementById("project_3_display").addEventListener("click", () => {
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
