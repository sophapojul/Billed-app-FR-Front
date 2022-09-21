import VerticalLayout from './VerticalLayout.js';

export default (error) => (`
    <div class='layout'>
      ${VerticalLayout()}
      <div class='content'>
        <div class='content-header'>
          <div class='content-title'> Erreur </div>
        </div>
        <div data-testid="error-message">
          ${error || ''}
        </div>
    </div>`
);
