import { useState } from "react";

const TaskCard = ({ task, onDelete, onUpdateTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDesc, setEditDesc] = useState(task.description || "");

  const nextStatus = (status) => {
    if (status === "todo") return "in-progress";
    if (status === "in-progress") return "done";
    return "todo";
  };

  const handleSave = async () => {
    if (!editTitle.trim()) return;

    await onUpdateTask(task._id, { title: editTitle.trim(), description: editDesc.trim() });
    setIsEditing(false);
  };

  const handleStatus = async () => {
    await onUpdateTask(task._id, { status: nextStatus(task.status) });
  };

  return (
    <div className="card task-card">
      <div className="task-header">
        {isEditing ? (
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Title"
          />
        ) : (
          <h4>{task.title}</h4>
        )}

        <span className={`status ${task.status}`}>{task.status}</span>
      </div>

      {isEditing ? (
        <textarea
          value={editDesc}
          onChange={(e) => setEditDesc(e.target.value)}
          placeholder="Description"
        />
      ) : (
        <p>{task.description || "No description"}</p>
      )}

      <div className="task-meta">
        <span>Priority: {task.priority}</span>
        {task.dueDate && (
          <span> Due: {new Date(task.dueDate).toLocaleDateString()}</span>
        )}
      </div>

      <div className="task-actions">
        {isEditing ? (
          <>
            <button onClick={handleSave} disabled={!editTitle.trim()}>
              Save
            </button>
            <button onClick={() => {
              setIsEditing(false);
              setEditTitle(task.title);
              setEditDesc(task.description || "");
            }} className="delete">
              Cancel
            </button>
          </>
        ) : (
          <>
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <button onClick={handleStatus}>Change Status</button>
            <button onClick={() => onDelete(task._id)} className="delete">
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
