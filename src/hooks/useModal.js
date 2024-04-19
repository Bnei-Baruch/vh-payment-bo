import { useState } from "react";

export const useModal = (onHideCallback = () => null) => {
  const [isVisible, setVisible] = useState(false);

  const showModal = () => setVisible(true);

  const hideModal = () => {
    setVisible(false);

    if (onHideCallback) {
      onHideCallback();
    }
  };

  return { isVisible, hideModal, showModal };
};
