/* eslint-disable no-proto */
const fs = require('fs')
const express = require('express')
const multer = require('multer')
const { v4 } = require('uuid')
const Upload = require('../file_upload')

const router = express.Router()
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, global.upload_path)
	},
	filename: function (req, file, cb) {
		cb(null, v4())
	}
})
const upload = multer({ storage: storage })

// File Submission Form
router.post('/', upload.single('file'), function (req, res) {
	console.log(req.file, req.body)
	const id = req.user._id
	const params = {uploader_id: id, uploader: req.body.uploader, title: req.body.key }
	params.file_name = req.file.originalname
	params.upload_path = req.file.path
	params.upload_name = req.file.filename
	params.mime_type = req.file.mimetype
	params.size = req.file.size
	new Upload(params).save().then(() => {
		res.redirect('/uploads')
	}).catch(err => {
		res.send('Error: ' + err)
		fs.unlinkSync(params.upload_path)
	})
})

// POST form to delete files
router.delete('/:id', async function (req, res) {
	const id = req.params.id
	let file

	try {
		file = await Upload.findOne({_id: id})
	} catch (err) {
		res.status(404).send(`Unable to retrive upload entry with Id ${id}`)
		return
	}

	if (req.user._id != file.uploader_id){
		res.status(403).send('You do not have permission to delete this file')
		return
	}

	if(await Upload.deleteOne({_id: id})){
		fs.unlinkSync(file.upload_path)
		res.status(200).send()
	}
	else {
		res.status(500)
	}
})

router.get('/', function (req, res) {
	Upload.find({}).sort({updatedAt: 'desc'}).exec().then((results) => {
		const entries = []
		results.forEach(result => {
			const entry = result.toJSON({virtuals: true})
			entry.created_at = new Date(Date.parse(entry.createdAt + ' UTC'))
			entry.updated_at = new Date(Date.parse(entry.updatedAt + ' UTC'))
			delete entry.createdAt
			delete entry.updatedAt
			entries.push(entry)
		})
		res.render('uploads', { entries: entries, title: 'Uploads - Drive++' })
	}).catch(err => {
		res.send('Error: ' + err)
	})
})

router.get('/user', function(req, res){
	Upload.find({uploader_id: req.user._id}).sort({updatedAt: 'desc'}).exec().then((results) => {
		const entries = []
		results.forEach(result => {
			const entry = result.toJSON({virtuals: true})
			entry.created_at = new Date(Date.parse(entry.createdAt + ' UTC'))
			entry.updated_at = new Date(Date.parse(entry.updatedAt + ' UTC'))
			delete entry.createdAt
			delete entry.updatedAt
			entries.push(entry)
		})
		res.render('uploads', { entries: entries, title: 'Uploads - Glitch Drive' })
	}).catch(err => {
		res.send('Error: ' + err)
	})
})

router.put('/file/:id', async function(req, res){
	let file
	let id = req.params.id
	let {title, uploader} = req.body
	try {
		file = await Upload.findOne({_id: id})
	} catch (err) {
		res.status(404).send(`Unable to retrive upload entry with Id ${id}`)
		return
	}

	if (req.user._id != file.uploader_id){
		res.status(403).send('You do not have permission to delete this file')
		return
	}

	file.title = title
	file.uploader = uploader
	file.save().then(() => {
		res.status(200).send()
	}).catch((err) => {
		res.status(500).send(err._message)
	})
})

router.get('/capacity', async function (req, res) {
	Upload.aggregate([{ $group: { _id: null, size: { $sum: '$size' } }}]).exec((err, data) => {
		if(err){
			res.json({error: err})
		}
		else{
			if(!data[0])
				res.json({capacity: 0})
			else
				res.json({capacity: data[0].size})
		}
	})
})

module.exports = router
