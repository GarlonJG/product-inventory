import React from 'react'
import ItemModal from './ItemModal'

describe('<ItemModal />', () => {

  const mockProps = {
    form: { id: null, name: '', sku: '', description: '', stock: 0, price: 0 },
  };

  it('renders', () => {
    cy.mount(<ItemModal form={mockProps.form} />)
    cy.injectAxe();
    
    //Configure aXe to exclude document-level rules for this modal test
    //This is because the modal is not a complete document
    const axeOptions = {
      rules: {
        'html-has-lang': { enabled: false },      // Document-level rule
        'landmark-one-main': { enabled: false },  // Document-level rule
        'page-has-heading-one': { enabled: false } // Document-level rule
      }
    };

    //Check accessibility with custom options
    cy.checkA11y(undefined, axeOptions);
  })
})