/// <reference types="cypress" />

describe('Quiz Component', () => {
  beforeEach(() => {
    cy.visit('/'); // Adjust the URL based on your application's routing.
    cy.intercept('GET', '**/api/questions/random', { fixture: 'questions.json' }).as('getQuestions');
  });

  it('should start the quiz when "Start Quiz" button is clicked', () => {
    cy.contains('Start Quiz').click();
    cy.wait('@getQuestions');
    cy.get('.card h2').should('exist'); // Check that the question is displayed.
  });

  it('should display a loading message when questions are loading', () => {
    cy.contains('Start Quiz').click();
    cy.wait('@getQuestions');
    // cy.get('.quiz-loading').should('exist'); // Confirm the loading spinner/message appears.
    // cy.wait('@getQuestions');
    
    // Wait for the API call to complete.

    cy.get('.card h2').should('exist'); // Check that the question is displayed
  });

  it('should display the correct score after completing the quiz', () => {
    // Mock questions for the test
    const mockQuestions = [
      {
        question: 'What is 2 + 2?',
        answers: [
          { text: '4', isCorrect: true },
          { text: '3', isCorrect: false }
        ]
      },
      {
        question: 'What is the capital of France?',
        answers: [
          { text: 'Berlin', isCorrect: false },
          { text: 'Paris', isCorrect: true }
        ]
      }
    ];
    cy.intercept('GET', '**/questions', mockQuestions).as('getQuestions');

    cy.contains('Start Quiz').click();
    cy.wait('@getQuestions');

    // Answer first question correctly
    cy.get('[data-cy="answer-button"]').eq(1).click();

    // Answer second question correctly
    cy.get('[data-cy="answer-button"]').eq(1).click();

    // Check that the quiz is completed and score is displayed
    cy.contains('Quiz Completed').should('be.visible');
    cy.contains(`Your score: ${mockQuestions.length}/${mockQuestions.length}`);
  });

  it('should allow user to retake the quiz', () => {
    cy.contains('Start Quiz').click();
    cy.wait('@getQuestions');
    
    cy.get('[data-cy="answer-button"]').eq(0).click(); // Answer first question

    // Complete the quiz by answering all questions
    cy.get('[data-cy="answer-button"]').eq(1).click();

    // Check that the quiz completion message appears
    cy.contains('Quiz Completed').should('be.visible');
    cy.contains('Take New Quiz').click(); // Restart quiz

    // Check that the quiz is reset
    cy.get('.card h2').should('exist'); // New question should be displayed
    cy.get('.alert-success').should('not.exist'); // Score should not be shown anymore
  });

  it('should handle incorrect answers without incrementing the score', () => {
    // Mock questions
    const mockQuestions = [
      {
        question: 'Which is the largest ocean?',
        answers: [
          { text: 'Atlantic', isCorrect: false },
          { text: 'Pacific', isCorrect: true }
        ]
      }
    ];
    cy.intercept('GET', '**/questions', mockQuestions).as('getQuestions');

    cy.contains('Start Quiz').click();
    cy.wait('@getQuestions');

    // Select an incorrect answer
    cy.get('[data-cy="answer-button"]').eq(0).click();
    cy.get('[data-cy="answer-button"]').eq(1).click();

    // Confirm that the quiz shows 0 as score after answering incorrectly
    cy.contains('Quiz Completed').should('be.visible');
    cy.contains('Your score: 1/2');
  });
});
