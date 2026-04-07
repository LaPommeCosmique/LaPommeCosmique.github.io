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
    // deselect everything when project shortcut is presesd
    document.getElementById("projects_shortcut").addEventListener("click", showDisplay)

    const holder = document.getElementById("projects_content_holder")

    const display = document.getElementById("project_display")
    const projectIds = ["project_1", "project_2", "project_3", "project_4", "project_5", "project_6"]
    const projectDisplays = projectIds.map(id => document.getElementById(id))

    function showDisplay() {
      display.style.display = ''
      projectDisplays.forEach(d => d.style.display = 'none')

      holder.scrollIntoView()
    }
    
    // add functionality
    document.querySelectorAll(".project_back").forEach(e => e.addEventListener("click", showDisplay))
    projectIds.forEach((id, i) => {
      document.getElementById(id + "_display").addEventListener("click", () => {
        display.style.display = 'none'
        projectDisplays.forEach((d, j) => d.style.display = i === j ? '' : 'none')
        holder.scrollIntoView()
      })
    })

    // initialize
    display.style.display = ''
    projectDisplays.forEach(d => d.style.display = 'none')
  })()
})
