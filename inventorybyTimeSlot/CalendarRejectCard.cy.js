describe('CalendarRejectCard', () => {
  beforeEach(() => {
    cy.visit('/your-page'); // Replace with the actual page URL
  });

  it('displays the order information', () => {
    cy.get('.orderInfo').should('exist');
    cy.get('.orderId').should('contain', 'Order ID');
    cy.get('.purchaserName').should('contain', 'Purchaser name');
    cy.get('.productName').should('contain', 'Product name');
  });

  it('allows selecting rejection type and reason', () => {
    cy.get('.selectBoxContainer')
      .eq(0)
      .as('rejectionTypeSelectBox');

    // Select rejection type
    cy.get('@rejectionTypeSelectBox').find('.SelectMedium__control').click();
    cy.get('.SelectMedium__option').first().click();

    // Select reason (if applicable)
    cy.get('@rejectionTypeSelectBox').next('.selectBoxContainer').as('reasonSelectBox');
    cy.get('@reasonSelectBox').find('.SelectMedium__control').click();
    cy.get('.SelectMedium__option').first().click();
  });

  it('allows entering description text', () => {
    cy.get('.descriptionContainer textarea').type('This is a test description');
  });

  it('triggers the rejection callback when "Crop Image" button is clicked', () => {
    cy.get('.descriptionContainer textarea').type('This is a test description');
    cy.get('.descriptionContainer textarea').should('have.value', 'This is a test description');

    // Trigger rejection action
    cy.get('.descriptionWrapper button').contains('Crop Image').click();

    // Assert that the rejection action was triggered correctly
    // Add your own assertions here based on the expected behavior of the rejection action
  });
});
