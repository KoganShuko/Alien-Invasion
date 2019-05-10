class ControlPanel {
  constructor(options) {
    this.container = options.container;
    this.controlPanelContainer = $('<div>')
      .addClass('control-panel');
    const controlPanelCloseButton = $('<button>')
      .addClass('control-panel__button close-button')
      .appendTo(this.controlPanelContainer);
    const rulesContainer = $('<div>')
      .addClass('control-panel__rules rules-list__container')
      .appendTo(this.controlPanelContainer);
    const firstRule = $('<div>')
      .addClass('rules-list__item')
      .appendTo(rulesContainer);
    const secondRule = $('<div>')
      .addClass('rules-list__item')
      .appendTo(rulesContainer);

    $(options.button).on('click', () => {
      $(this.controlPanelContainer)
        .css({
          display: 'block',
        })
        .appendTo(this.container)
        .animate({
          opacity: 1,
        }, 500);
    });
    $(controlPanelCloseButton).on('click', async () => {
      await $(this.controlPanelContainer).animate({
        opacity: 0,
      }, 500)
        .promise();
      $(this.controlPanelContainer)
        .css({
          display: 'none',
        });
    });
    $(controlPanelCloseButton).on('mousedown', (event) => {
      event.preventDefault();
    });
  }
}

export default ControlPanel;
