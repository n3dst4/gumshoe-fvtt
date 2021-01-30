export const confirmADoodleDo = (
  message: string,
  confirmText: string,
  canceltext: string,
  confirmIconClass: string,
  callback: () => void,
) => {
  const d = new Dialog({
    title: "Confirm",
    content: `<p>${message}</p>`,
    buttons: {
      cancel: {
        icon: '<i class="fas fa-ban"></i>',
        label: canceltext,
      },
      delete: {
        icon: `<i class="fas ${confirmIconClass}"></i>`,
        label: confirmText,
        callback,
      },
    },
    default: "cancel",
  });
  d.render(true);
};
