const Topic = require('../model/TopicModel')
const Quiz = require('../model/QuizModel');
const QuestionModel = require('../model/QuestionModel');
const Lesson = require('../model/LessonModel')

class LessonDetailController {

    //Get /
    async index(req, res, next) {
        if (req.query.lessonId == null) {
            res.render('404')
            return;
        }

        try {
            const topic = await Topic.find({ lessonId: req.query.lessonId })
            var listTopic = []
            for (var i of topic) {
                var tp = new TopicMD(i.lessonId, i.title, i.content, i._id)
                listTopic.push(tp)
            }
            const quiz = await Quiz.findOne({ lessonId: req.query.lessonId })
            var listQuestion = []
            const question = await QuestionModel.find({ quizId: quiz._id }).sort({ STT: 1 })
            for (var i of question) {
                var qz = new QuizMD(i.STT, i.quizId, i.question, i.answerA, i.answerB, i.answerC, i.answerD, i.correctAnswer, i._id, req.query.lessonId)
                listQuestion.push(qz)
            }
            res.render('lesson_detail', { quiz: listQuestion, topic: listTopic })

        } catch (e) {
            res.json({
                message: 'Có lỗi',
                error: e.message,
                status: false
            })
        }
    }


    //delete topic:
    async deleteTopic(req, res, next) {
        if (req.body.id_topic == null) {
            res.json({ message: 'Cần truyền params id', status: false })
            return
        }
        Topic.deleteOne({ _id: req.body.id_topic }, function (err) {
            if (err) {
                res.json({ message: 'Delete failed', status: false, err: err })
                return
            }
        })
        const ls = await Lesson.findById(req.body.lessonId);
        ls.totalTopic = ls.totalTopic - 1
        await ls.save().catch(err => {
            res.json({ message: 'Delete failed', status: false, err: err })
            return
        })
        res.redirect('/lesson_detail?lessonId=' + req.body.lessonId)
    }

    //delete quiz:
    deleteQuiz(req, res, next) {
        console.log(req.body)
        if (req.body.id == null) {
            res.json({ message: 'Cần truyền params id', status: false })
            return
        }
        QuestionModel.deleteOne({ _id: req.body.id }, function (err) {
            if (err) {
                res.json({ message: 'Delete failed', status: false, err: err })
                return
            }
            res.redirect('/lesson_detail?lessonId=' + req.body.lessonId)
        })
    }
}

class TopicMD {
    lessonId
    title
    content
    _id

    constructor(lessonId, title, content, _id) {
        this.lessonId = lessonId
        this.title = title
        this.content = content
        this._id = _id
    }
}

class QuizMD {
    STT
    quizId
    question
    answerA
    answerB
    answerC
    answerD
    correctAnswer
    _id
    lessonId

    constructor(STT, quizId, question, answerA, answerB, answerC, answerD, correctAnswer, _id, lessonId) {
        this.STT = STT
        this.quizId = quizId
        this.answerA = answerA
        this.answerB = answerB
        this.answerC = answerC
        this.answerD = answerD
        this.question = question
        this.correctAnswer = correctAnswer
        this._id = _id
        this.lessonId = lessonId
    }
}

module.exports = new LessonDetailController()
