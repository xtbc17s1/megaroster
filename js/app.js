$(document).foundation()

const megaroster = {
  students: [],

  init(listSelector) {
    this.studentList = document.querySelector(listSelector)
    this.max = 0
    this.setupEventListeners()
    this.load()
  },

  setupEventListeners() {
    document
      .querySelector('#new-student')
      .addEventListener('submit', this.addStudentViaForm.bind(this))
  },

  save() {
    localStorage.setItem('roster', JSON.stringify(this.students))
  },

  load() {
    const rosterString = localStorage.getItem('roster')
    const rosterArray = JSON.parse(rosterString)
    rosterArray
      .reverse()
      .map(this.addStudent.bind(this))
  },

  removeStudent(ev) {
    const btn = ev.target
    const li = btn.closest('.student')

    for (let i=0; i < this.students.length; i++) {
      let currentId = this.students[i].id.toString()
      if (currentId === li.dataset.id) {
        this.students.splice(i, 1)
        break
      }
    }

    li.remove()
    this.save()
  },

  addStudentViaForm(ev) {
    ev.preventDefault()
    const f = ev.target
    const student = {
      id: this.max + 1,
      name: f.studentName.value,
    }
    this.addStudent(student)
    f.reset()
  },

  addStudent(student, append) {
    this.students.unshift(student)

    const listItem = this.buildListItem(student)
    this.prependChild(this.studentList, listItem)

    if (student.id > this.max) {
      this.max = student.id
    }
    this.save()
  },

  prependChild(parent, child) {
    parent.insertBefore(child, parent.firstChild)
  },

  buildListItem(student) {
    const template = document.querySelector('.student.template')
    const li = template.cloneNode(true)
    this.removeClassName(li, 'template')
    li.querySelector('.student-name').textContent = student.name
    li.dataset.id = student.id

    li
      .querySelector('button.remove')
      .addEventListener('click', this.removeStudent.bind(this))
    return li
  },

  removeClassName(el, className){
    el.className = el.className.replace(className, '').trim()
  }
}
megaroster.init('#studentList')
