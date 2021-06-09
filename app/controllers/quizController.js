const { Quiz } = require('../models');

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
                order: [['questions', 'level_id', 'ASC'],['questions','answers', 'description', 'desc']],
            });

            if (!quiz) {
                return next();
            }

            response.render('quiz', { quiz, title: quiz.title });
        } catch (error) {
            console.error(error);
        }
    }

};