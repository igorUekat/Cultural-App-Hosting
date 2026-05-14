import React from 'react';
import Pagination from 'react-bootstrap/Pagination';

function Pagi(props) { 
  return (
    <div style={{display: 'flex', flexDirection: 'column', alignItems:"center"}}>
      <Pagination className="custom-pagination">
        {props.currentPage !== 0 && <Pagination.First className="custom-page-item"onClick={() => props.changePage(0)}/>}
        {props.currentPage !== 0 && <Pagination.Item className="custom-page-item" onClick={() => props.changePage(0)}>{1}</Pagination.Item>}
        {props.currentPage - 1 > 0 &&<Pagination.Item className="custom-page-item" onClick={() => props.changePage(props.currentPage - 1)}>{props.currentPage}</Pagination.Item>}
        <Pagination.Item active className="custom-page-item active-page">{props.currentPage + 1}</Pagination.Item>
        {props.currentPage + 1 < props.maxValue && <Pagination.Item className="custom-page-item" onClick={() => props.changePage(props.currentPage + 1)}>{props.currentPage + 2}</Pagination.Item>}
        {props.currentPage !== props.maxValue && <Pagination.Item className="custom-page-item" onClick={() => props.changePage(props.maxValue)}>{props.maxValue + 1}</Pagination.Item>}
        {props.currentPage !== props.maxValue && <Pagination.Last className="custom-page-item" onClick={() => props.changePage(props.maxValue)}/>}
      </Pagination>
    </div>
  );
}
export default Pagi;