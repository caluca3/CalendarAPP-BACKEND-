

export const CalendarEvent = ({event}) => {
  const {title,user}=event;
  //console.log({title,user})
    return (
    <>
      <strong>{title}</strong>
      <span>-{user.name}</span>
    </>
  )
}
