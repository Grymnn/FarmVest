// Switch function
const switchTheme = () => {
  //Get root element and data-theme value
  const rootElem = document.documentElement
  let dataTheme = rootElem.getAttribute('data-theme'), newTheme

  newTheme = (dataTheme === 'light') ? 'dark' : 'light'

  //Set the new HTML attribute
  rootElem.setAttribute('data-theme', newTheme)

  //Set the new local storage item
  localStorage.setItem('theme', newTheme)
}

//Add event listener for the theme switcher
document.querySelector('#theme-switcher').addEventListener('click', switchTheme)

//Dropdown content function
const openDropdown = document.querySelectorAll(".dropbtn")

openDropdown.forEach((openDropdown) => {
	openDropdown.addEventListener("click", () => {
		if (openDropdown.classList.contains("open-dropdown")) {
			openDropdown.classList.remove("open-dropdown")
		} else {
			const isOpen = document.querySelectorAll(".open-dropdown")
			isOpen.forEach((isOpen) => {
				isOpen.classList.remove("open-dropdown")
			})
			openDropdown.classList.add("open-dropdown")
		}
	})
})