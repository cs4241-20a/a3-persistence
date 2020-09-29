const request_delete = function (id, name) {
	let key = confirm(`Are you sure you want to delete ${name}?`)
	if(!key){
		return
	}
	fetch(`/uploads/${id}`, {method: 'DELETE'}).then((res) => {
		if(!res.ok){
			alert(`Error (${res.status}): ${res.statusText}`)
		}
		else {
			const el = document.getElementById(`${id}-panel`)
			el.remove()
			ping_capacity()
		}
	})
		.catch(err => {
			alert(`Error: ${err}`)
		})
}

const entries = document.querySelectorAll('.panel')

class Entry {
	constructor(id){
		this.id = id
		this.edit_state = false
		this.delete_btn = this.get('delete')
		this.file_name = this.get('file_name')
		this.edit_toggle_btn = this.get('edit-toggle')
		this.created_at = this.get('created_at')
		this.title_view = this.get('title-view')
		this.title_edit = this.get('title-edit')
		this.update_btn = this.get('update')
		this.title_input = this.get('title-input')
		this.uploader_input = this.get('uploader-input')
	}
	init(){
		this.created_at.innerText = new Date(Date.parse(this.created_at.innerText)).toLocaleString()
		if(this.delete_btn){
			this.delete_btn.addEventListener('click', () => {
				request_delete(this.id, this.file_name.innerText)
			})
		}

		if(this.edit_toggle_btn){
			this.edit_toggle_btn.addEventListener('click', () => {
				this.edit_state = !this.edit_state
				if(this.edit_state){
					this.title_view.hidden = true
					this.title_edit.hidden = false
				}
				else {
					this.title_view.hidden = false
					this.title_edit.hidden = true
				}
			})
		}

		if(this.update_btn) {
			this.update_btn.addEventListener('click', () => {
				let params = JSON.stringify({title: this.title_input.value, uploader: this.uploader_input.value})
				fetch(`/uploads/file/${this.id}`, {method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: params}).then((res) => {
					if(res.status != 200){
						res.text().then((text) => {
							alert(`Error (${res.status}): ${text}`)
						})
					}
					else {
						location.reload()
					}
				})
			})
		}
	}
	get(suffix){
		return document.getElementById(`${this.id}-${suffix}`)
	}
}

const items = []

for(let i = 0; i < entries.length; i++){
	let id = entries[i].id.split('-')[0]
	items.push(new Entry(id))
	items[i].init()
}

// entries.forEach(entry => {
// 	const id = entry.id.split('-')[0]
// 	const et = new Entry(id)
// 	et.init()
// })
