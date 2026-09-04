import { Modal, ModalCloseTrigger, useOverlayState } from "@heroui/react";
import React from "react";

type Props = {
  state: ReturnType<typeof useOverlayState>;
  title?: string;
  footer?: React.ReactNode;
  dialogClassName?: string;
  children?: React.ReactNode;
};

export default function AppModal({
  state,
  title,
  footer,
  dialogClassName,
  children,
}: Props) {
  return (
    <Modal state={state}>
      <Modal.Backdrop>
        <Modal.Container>
          <Modal.Dialog className={dialogClassName}>
            <Modal.Header>
              {title && (
                <Modal.Header>
                  {title}
                  <ModalCloseTrigger />
                </Modal.Header>
              )}
            </Modal.Header>
            <Modal.Body>{children}</Modal.Body>
            {footer && <Modal.Footer>{footer}</Modal.Footer>}
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
