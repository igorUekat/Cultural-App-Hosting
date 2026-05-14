import React from 'react'


//event-text-area-dark event-text-area-light
function EventTextArea(props){
    const isDarkStyle = props.isDark ? 'event-text-area-dark' : 'event-text-area-light';
    return(
        <div className={isDarkStyle}>
            {props.content}
        </div>
    );
}

export default EventTextArea;