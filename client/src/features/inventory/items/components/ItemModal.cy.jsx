import React from 'react'
import ItemModal from './ItemModal'

describe('<ItemModal />', () => {

  const mockProps = {
    form: { id: null, name: '', sku: '', description: '', stock: 0, price: 0 },
  };

  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<ItemModal form={mockProps.form} />)
    cy.injectAxe();
    cy.checkA11y(undefined, undefined, (violations) => {
      // This will print the violations to the Cypress command log
      cy.task('log', `${violations.length} accessibility violation${violations.length === 1 ? '' : 's'} detected`);
      violations.forEach((violation) => {
        cy.task('log', `- ${violation.description} (${violation.id}): ${violation.helpUrl}`);
        violation.nodes.forEach((node) => {
          cy.task('log', `  - ${node.failureSummary}`);
        });
      });
    }, true); // The 'true' makes the test fail if there are violations
  })
})