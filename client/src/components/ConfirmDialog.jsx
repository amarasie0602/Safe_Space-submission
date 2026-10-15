import Dialog from './Dialog';

const ConfirmDialog = ({ title, message, confirmLabel = 'Confirm', danger, onConfirm, onCancel }) => (
  <Dialog role="alertdialog" labelledBy="dialog-title" onClose={onCancel}>
    <h2 id="dialog-title">{title}</h2>
    <p>{message}</p>
    <div className="card-actions">
      <button type="button" className="btn btn-ghost" onClick={onCancel}>
        Cancel
      </button>
      <button
        type="button"
        className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`}
        onClick={onConfirm}
      >
        {confirmLabel}
      </button>
    </div>
  </Dialog>
);

export default ConfirmDialog;
