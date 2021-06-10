const {
    response
} = require('express');
const {
    Quiz
} = require('../models');

module.exports = {

    quiz: async (request, response, next) => {

        try {
            //.then(quiz ==> const quiz = await 
            // .catch(error) ===> try {} catch(error){}

            const quiz = await Quiz.findByPk(request.params.id, {
                include: [
                    'author',
                    'tags',
                    {
                        association: 'questions',
                        include: ['level', 'answers']
                    }
                ],
                order: [
                    ['questions', 'level_id', 'ASC'],
                    ['questions', 'answers', 'description', 'desc']
                ],
            });

            if (!quiz) {
                return next();
            }

            if (request.session.user) {
                response.render('play_quiz', {
                    quiz,
                    title: quiz.title,
                });
            } else {
                response.render('quiz', {
                    quiz,
                    title: quiz.title
                });
            }
        } catch (error) {
            console.error(error);
        }
    },

    quizSubmitForm: async (request, response, next) => {
        try {
            const quiz = await Quiz.findByPk(request.params.id, {
                include: [
                    'author',
                    'tags',
                    {
                        association: 'questions',
                        include: ['level', 'answers', 'good_answer']
                    }
                ],
                order: [
                    ['questions', 'level_id', 'ASC'],
                    ['questions', 'answers', 'description', 'desc']
                ],
            });
            let score = 0;
            let user_answer = request.body
            for (property in user_answer) {
                if(property === user_answer[property]) {
                    score++;
                }
            }
            response.render('score', {
                score,
                quiz,
                user_answer
            });
        } catch (error) {
            console.error(error);
        }
    }

};