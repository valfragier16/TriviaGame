/*Game JavaScript Controls

-----------------------------------------------
1. What do you want to make?:
-----------------------------------------------
I want to create a trivia game the shows only one question until the player answers it or the time runes out.
If the player selects the correct answer, a gif should pop up congratulating the player.
If the player selects the wrong answer, the correct asnwer will be displayed but the text will indicate the player picked the wrong answer.

(Note: There should be a few seconds in between questions)

At the end of the game the screen should display the score: showing how many the player got wrong vs. right. An option to restart the game should be there.

-----------------------------------------------
2. What steps do you think are necessary?
----------------------------------------------- */


$(document).ready(function(){
  
    // event listeners
    $("#remaining-time").hide();
    $("#start").on('click', trivia.startGame);
    $(document).on('click' , '.option', trivia.guessChecker);
    
  })
  
  var trivia = {
    // Scorer Properties
    correct: 0,
    incorrect: 0,
    unanswered: 0,
    currentSet: 0,
    timer: 20,
    timerOn: false,
    timerId : '',


    // Define questions 
    questions: {
      q1: "In the anime series Full Metal Alchemist, what do Alchemists consider the greatest taboo?",
      q2: "Who create the animated movie Princess Mononoke(1997), and Spirited Away(2001)?",
      q3: "What is Naruto's favorite food?",
      q4: "In Dragon Ball Z, who was the first character to go Supeer Saiyan 2?",
      q5: "Who is Inuyasha's older brother?",
      q6: "In what show does the main character state he wants to be 'King of Pirates'?",
    },

    // Define choices of each question
    options: {
      q1: ["A. Eating Devil Fruit", "B. Human Transmutation", "C. Soul Stealing", "D. Summoning the Nine Tailed Beast"],
      q2: ["A. Hayao Miyazaki", "B. Akira Kurosawa", "C. Takeshi Kitano", "D. Naomi Kawase"],
      q3: ["A. Fried Fish", "B. Egg-rolls", "C. Ramen", "D. None of these"],
      q4: ["A. Vegeta", "B. Gohan", "C. Bulma", "D. Piccolo"],
      q5: ["A. Shippo", "B. Naraku", "C. Miroku", "D. Sesshomaru"],
      q6: ["A. One Piece", "B. Cowboy Bebop", "C. Death Note", "D. Bleach"],
    },

    // Answers for each qeustion
    answers: {
      q1: "B. Human Transmutation",
      q2: "A. Hayao Miyazaki",
      q3: "C. Ramen",
      q4: "B. Gohan",
      q5: "D. Sesshomaru",
      q6: "A. One Piece",
    },

    // Scores
    // method to initialize game
    startGame: function(){
      // restarting game results
      trivia.currentSet = 0;
      trivia.correct = 0;
      trivia.incorrect = 0;
      trivia.unanswered = 0;
      clearInterval(trivia.timerId);
      
      // show game section
      $('#game').show();
      
      //  empty last results
      $('#results').html('');
      
      // show timer
      $('#timer').text(trivia.timer);

      // remaining time
      $('#remaining-time').show();
      
      // remove start button
      $('#start').hide();
  
     
      
      // ask first question
      trivia.nextQuestion();
      
    },

    // Loop through the questions
    nextQuestion : function(){
      
    
      trivia.timer = 10;
       $('#timer').removeClass('last-seconds');
      $('#timer').text(trivia.timer);
      
    
      if(!trivia.timerOn){
        trivia.timerId = setInterval(trivia.timerRunning, 1000);
      }
      
      // gets all the questions then indexes the current questions
      var questionContent = Object.values(trivia.questions)[trivia.currentSet];
      $('#question').text(questionContent);
      
      // an array of all the user options for the current question
      var questionOptions = Object.values(trivia.options)[trivia.currentSet];
      
     
      $.each(questionOptions, function(index, key){
        $('#options').append($('<button class="option btn btn-info btn-lg">'+key+'</button>'));
      })
      
    },


    // Timer
    timerRunning : function(){
      // if timer still has time left and there are still questions left to ask
      if(trivia.timer > -1 && trivia.currentSet < Object.keys(trivia.questions).length){
        $('#timer').text(trivia.timer);
        trivia.timer--;
          if(trivia.timer === 4){
            $('#timer').addClass('last-seconds');
          }
      }
      // the time has run out and increment unanswered, run result
      else if(trivia.timer === -1){
        trivia.unanswered++;
        trivia.result = false;
        clearInterval(trivia.timerId);
        resultId = setTimeout(trivia.guessResult, 1000);
        $('#results').html('<h3>Out of time! The answer was '+ Object.values(trivia.answers)[trivia.currentSet] +'</h3>');
      }
      // if all the questions have been shown end the game, show results
      else if(trivia.currentSet === Object.keys(trivia.questions).length){
        
        // adds results of game (correct, incorrect, unanswered) to the page
        $('#results')
          .html('<h3>Thanks for playing!</h3>'+
          '<p>Correct: '+ trivia.correct +'</p>'+
          '<p>Incorrect: '+ trivia.incorrect +'</p>'+
          '<p>Unaswered: '+ trivia.unanswered +'</p>'+
          '<p>Please play again!</p>');
        
       
        $('#game').hide();
        
        // show start button to begin a new game
        $('#start').show();
      }
      
    },

    
    // method to evaluate the option clicked
    guessChecker : function() {
      
      // timer ID for gameResult setTimeout
      var resultId;
      
      // the answer to the current question being asked
      var currentAnswer = Object.values(trivia.answers)[trivia.currentSet];
      
      // if the text of the option picked matches the answer of the current question, increment correct
      if($(this).text() === currentAnswer){
        // turn button green for correct
        $(this).addClass('btn-success').removeClass('btn-info');
        
        trivia.correct++;
        clearInterval(trivia.timerId);
        resultId = setTimeout(trivia.guessResult, 1000);
        $('#results').html('<h3>You must know your anime! Correct Answer!</h3>');
      }
    
      else{
        // turn button red for incorrect
        $(this).addClass('btn-danger').removeClass('btn-info');
        
        trivia.incorrect++;
        clearInterval(trivia.timerId);
        resultId = setTimeout(trivia.guessResult, 1000);
        $('#results').html('<h3>Wrong Answer! Try watching more tv! '+ currentAnswer +'</h3>');
      }
      
    },

    // method to remove previous question results and options
    guessResult : function(){
      
      trivia.currentSet++;
      
      // remove the options and results
      $('.option').remove();
      $('#results h3').remove();
      
      // begin next question
      trivia.nextQuestion();
       
    }
  
  }