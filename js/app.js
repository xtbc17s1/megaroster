$(document).foundation()

const megaroster = {
  init() {
    document
      .querySelector('#new-student')
      .addEventListener('submit', this.addStudent)
  },

  addStudent(ev) {
    ev.preventDefault()
    const studentName = ev.target.studentName.value
    console.log(studentName)
  },
}
megaroster.init()
