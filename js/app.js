$(document).foundation()

const megaroster = {
  init() {
    this.max = 0
    document
      .querySelector('#new-student')
      .addEventListener('submit', this.addStudent.bind(this))
  },

  addStudent(ev) {
    ev.preventDefault()
    const f = ev.target
    const student = {
      id: this.max + 1,
      name: f.studentName.value,
    }
    
    this.buildListItem(student)
    this.max ++
  },

  buildListItem(student) {
    console.log(student)
  },
}
megaroster.init()
