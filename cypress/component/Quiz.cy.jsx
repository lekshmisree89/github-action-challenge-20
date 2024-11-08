// cypress/component/Quiz.cy.tsx
import Quiz from "../../client/src/components/Quiz";
import { mount } from "cypress/react18";

// Mock question data
const mockQuestions = [
  {
    question: "What is 2 + 2?",
    answers: [
      { text: "4", isCorrect: true },
      { text: "22", isCorrect: false },
      { text: "5", isCorrect: false },
    ],
  },
  {
    question: "What is 3 * 3?",
    answers: [
      { text: "6", isCorrect: false },
      { text: "9", isCorrect: true },
      { text: "33", isCorrect: false },
    ],
  },

  
];


   
describe("Quiz Component", () => {
  it("displays the Start Quiz button initially", () => {
    mount(<Quiz />);
    cy.contains("Start Quiz").should("be.visible");
  });

  it("loads questions and starts the quiz on clicking Start Quiz", () => {
    // Adjust the route to match what the component is requesting
    cy.intercept("GET", "/api/questions/random", mockQuestions).as(
      "getQuestions"
    );
    mount(<Quiz />);

    cy.contains("Start Quiz").click();
    cy.wait("@getQuestions"); // Wait for the request to finish
    cy.get(".quiz-loading").should("not.exist");
    cy.contains(mockQuestions[0].question).should("be.visible");
  });

  it("shows next question after answering a question", () => {
    cy.intercept("GET", "/api/questions/random", mockQuestions).as(
      "getQuestions"
    );
    mount(<Quiz />);

    cy.contains("Start Quiz").click();
    cy.wait("@getQuestions"); // Wait for the request to finish
    cy.get("[data-cy=answer-button]").first().click(); // Click the first answer
      // Click the correct answer
    cy.contains(mockQuestions[1].question).should("be.visible");
    
    
  });

  it("shows the final score and allows restarting after completing the quiz", () => {
    cy.intercept("GET", "/api/questions/random", mockQuestions).as(
      "getQuestions"
    );
    mount(<Quiz />);

    cy.contains("Start Quiz").click();
    cy.wait("@getQuestions");

    // Loop through each question and select the first answer marked as correct
    mockQuestions.forEach((question) => {
      cy.get("[data-cy=answer-button]")
        .eq(question.answers.findIndex((a) => a.isCorrect))
        .click(); // Click the correct answer based on its position
    });


    // Check if the final score is displayed correctly 
    //after answering all questions
    cy.contains(
      `Your score: ${mockQuestions.length}/${mockQuestions.length}`
    ).should("be.visible");

    // resstart the quiz   when the user clicks the "Take New Quiz" button
    cy.contains("Take New Quiz").click();
  });
});



// import Quiz from "../../client/src/components/Quiz"

// describe('Quiz Component', () => {
//   beforeEach(() => {
//     cy.intercept({
//         method: 'GET',
//         url: '/api/questions/random'
//       },
//       {
//         fixture: 'questions.json',
//         statusCode: 200
//       }
//       ).as('getRandomQuestion')
//     });

//   it('should start the quiz and display the first question', () => {
//     cy.mount(<Quiz />);
//     cy.get('button').contains('Start Quiz').click();
//     cy.get('.card').should('be.visible');
//     cy.get('h2').should('not.be.empty');
//   });

//   it('should answer questions and complete the quiz', () => {
//     cy.mount(<Quiz />);
//     cy.get('button').contains('Start Quiz').click();

//     // Answer questions
//     cy.get('button').contains('1').click();

//     // Verify the quiz completion
//     cy.get('.alert-success').should('be.visible').and('contain', 'Your score');
//   });

//   it('should restart the quiz after completion', () => {
//     cy.mount(<Quiz />);
//     cy.get('button').contains('Start Quiz').click();

//     // Answer questions
//     cy.get('button').contains('1').click();

//     // Restart the quiz
//     cy.get('button').contains('Take New Quiz').click();

//     // Verify the quiz is restarted
//     cy.get('.card').should('be.visible');
//     cy.get('h2').should('not.be.empty');
//   });
// });
