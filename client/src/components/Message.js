const Message = ({ content, type }) => {
  return (
    content.length > 0 && (
      <div className={`message ${type}`} style={{ opacity: type ? 1 : 0 }}>
        {content}
      </div>
    )
  );
};

export default Message;
