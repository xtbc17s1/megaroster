$(document).foundation()

class Megaroster {
  constructor(listSelector) {
    this.studentList = document.querySelector(listSelector)
    this.students = []
    this.max = 0
    this.setupEventListeners()
    this.load()
  }

  setupEventListeners() {
    document
      .querySelector('#new-student')
      .addEventListener('submit', this.addStudentViaForm.bind(this))
  }

  save() {
    localStorage.setItem('roster', JSON.stringify(this.students))
  }

  load() {
    const rosterString = localStorage.getItem('roster')
    if (rosterString) {
      const rosterArray = JSON.parse(rosterString)
      rosterArray
        .reverse()
        .map(this.addStudent.bind(this))
    }
  }

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
  }

  promoteStudent(student, ev) {
    const btn = ev.target
    const li = btn.closest('.student')
    student.promoted = !student.promoted

    if (student.promoted) {
      li.classList.add('promoted')
    } else {
      li.classList.remove('promoted')
    }
    
    this.save()
  }

  addStudentViaForm(ev) {
    ev.preventDefault()
    const f = ev.target
    const student = {
      id: this.max + 1,
      name: f.studentName.value,
    }
    this.addStudent(student)
    f.reset()
  }

  addStudent(student, append) {
    this.students.unshift(student)

    const listItem = this.buildListItem(student)
    this.prependChild(this.studentList, listItem)

    if (student.id > this.max) {
      this.max = student.id
    }
    this.save()
  }

  prependChild(parent, child) {
    parent.insertBefore(child, parent.firstChild)
  }

  buildListItem(student) {
    const template = document.querySelector('.student.template')
    const li = template.cloneNode(true)
    this.removeClassName(li, 'template')
    li.querySelector('.student-name').textContent = student.name
    li.dataset.id = student.id

    if(student.promoted) {
      li.classList.add('promoted')
    }

    this.setupActions(li, student)
    return li
  }

  setupActions(li, student) {
    li
      .querySelector('button.remove')
      .addEventListener('click', this.removeStudent.bind(this))

    li
      .querySelector('button.promote')
      .addEventListener('click', this.promoteStudent.bind(this, student))

    li
      .querySelector('button.move-up')
      .addEventListener('click', this.moveUp.bind(this, student))

    li
      .querySelector('button.move-down')
      .addEventListener('click', this.moveDown.bind(this, student))

    li
      .querySelector('button.edit')
      .addEventListener('click', this.edit.bind(this, student, li.querySelector('.student-name')))

    // li
    //   .querySelector('[contenteditable]')
    //   .addEventListener('blur', this.updateName.bind(this, student))

    // li
    //   .querySelector('[contenteditable]')
    //   .addEventListener('keypress', this.saveOnEnter.bind(this))
  }

  edit(student, nameField, ev) {
    const btn = ev.currentTarget
    const icon = btn.querySelector('i.fa')

    if (nameField.isContentEditable) {
      nameField.contentEditable = false
      btn.classList.remove('success')
      icon.classList.remove('fa-check')
      icon.classList.add('fa-pencil')
      student.name = nameField.textContent
      this.save()
    } else {
      nameField.contentEditable = true
      btn.classList.add('success')
      icon.classList.remove('fa-pencil')
      icon.classList.add('fa-check')
      nameField.focus()
    }
  }

  saveOnEnter(ev) {
    if (ev.keyCode === 13) {
      ev.preventDefault()
      ev.target.blur()
    }
  }

  // updateName(student, ev) {
  //   student.name = ev.target.textContent
  //   this.save()
  // }

  moveUp(student, ev) {
    const btn = ev.target
    const li = btn.closest('.student')

    const index = this.students.findIndex((currentStudent, i) => {
      return currentStudent.id === student.id
    })

    if (index > 0) {
      this.studentList.insertBefore(li, li.previousElementSibling)

      const previousStudent = this.students[index - 1]
      this.students[index - 1] = student
      this.students[index] = previousStudent

      this.save()
    }
  }

  moveDown(student, ev) {
    const btn = ev.target
    const li = btn.closest('.student')

    const index = this.students.findIndex((currentStudent, i) => {
      return currentStudent.id === student.id
    })

    if (index < this.students.length - 1) {
      this.studentList.insertBefore(li.nextSibling, li)

      const nextStudent = this.students[index + 1]
      this.students[index + 1] = student
      this.students[index] = nextStudent

      this.save()
    }
  }

  removeClassName(el, className){
    el.className = el.className.replace(className, '').trim()
  }
}
const roster = new Megaroster('#studentList')
