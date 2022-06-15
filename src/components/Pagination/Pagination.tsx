import React, { useState } from 'react';
import arrowNext from '../../assets/svgs/arrowLeft.svg';
import arrowPrev from '../../assets/svgs/arrowRight.svg';
import arrowNextActive from '../../assets/svgs/arrowLeftActive.svg';
import arrowPrevActive from '../../assets/svgs/arrowRightActive.svg';
import './Pagination.scss';
import { PaginationSelect } from '../App/App';
import dropdown from '../../assets/svgs/dropdown.svg';
import arrow from '../../assets/svgs/arrow.svg';
import { useDataContext } from '../../context';

enum Enums{
  initialRowsValue = 1,
  siblingCount = 1
}

interface Props{
  currentPage: number
  onPageChange: (page: number) => void
  onRowsPerPageChange: (option: number) => void
  rowsPerPage: number
  totalPageCount: number
  paginationSelect: PaginationSelect[]
}

export function Pagination({
  onPageChange, currentPage, onRowsPerPageChange, rowsPerPage, paginationSelect, totalPageCount,
}: Props) {
  const { data } = useDataContext();
  const [quantityRows, setQuantityRows] = useState<number>(rowsPerPage);
  const [startRowsValue, setStartRowsValue] = useState<number>(Enums.initialRowsValue);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const leftSiblingIndex = currentPage === 1 ? null : Math.max(currentPage - Enums.siblingCount);
  const rightSiblingIndex = Math.min(
    currentPage + Enums.siblingCount,
    totalPageCount,
  );

  const onClick = () => {
    onPageChange(totalPageCount);
  };

  const onClickNext = () => {
    onPageChange(currentPage + 1);

    setStartRowsValue(startRowsValue + rowsPerPage);

    if (quantityRows > data.length) {
      setQuantityRows(data.length - 1);
      return;
    }
    setQuantityRows(quantityRows + rowsPerPage);
  };

  const onClickPrev = () => {
    onPageChange(currentPage - 1);
    setQuantityRows(quantityRows - rowsPerPage);
    setStartRowsValue(startRowsValue - rowsPerPage);
  };

  const onChangeOption = (option: number) => {
    onRowsPerPageChange(option);
    setQuantityRows(option);
    setStartRowsValue(Enums.initialRowsValue);
    onPageChange(1);
    setIsOpen(!isOpen);
  };

  const onClickDropdown = () => setIsOpen(!isOpen);

  const isArrowButtonDisabled = quantityRows >= data.length ? data.length : quantityRows;

  const isFirstPageIndex = currentPage !== 1;
  const isLastPageIndex = totalPageCount !== currentPage;
  const notLast = currentPage <= totalPageCount - 3;

  return (
    <div
      className="pagination-wrapper pagination"
    >
      <span>
        Rows per page
      </span>
      <div
        className="pagination-select"
      >
        <div className="pagination-select__quantity" onClick={onClickDropdown}>
          <span>{rowsPerPage}</span>
          <img src={isOpen ? dropdown : arrow} alt="arrow" />
        </div>
        {isOpen && (
        <div className="pagination-select__tooltip-select">
          <div className="pagination-select__tooltip-select-arrow" />
          <div className="pagination-select__tooltip-select-label">
            {paginationSelect.map((select) => (
              <div
                onClick={() => onChangeOption(select.option)}
                className="pagination-select__option"
                key={select.id}
                style={{
                  background: select.option === quantityRows ? 'rgba(124, 128, 134, 0.15)' : '',
                }}
              >
                {select.option}
              </div>
            ))}
          </div>
        </div>
        )}
      </div>
      <span className="pagination__rows-per-page">
        {startRowsValue}
        {' '}
        -
        {' '}
        {isArrowButtonDisabled}
        {' '}
        of
        {' '}
        {data.length}
      </span>
      <div className="pagination__items-wrapper">
        <button className="pagination__prev-page" onClick={onClickPrev} disabled={startRowsValue === Enums.initialRowsValue}>
          <img src={startRowsValue === Enums.initialRowsValue ? arrowPrev : arrowPrevActive} alt="prev" />
        </button>
        <div className="pagination__items">
          {isFirstPageIndex && <span className="pagination__item" onClick={onClickPrev}>{leftSiblingIndex}</span>}
          <span className="pagination__item_selected">{currentPage}</span>
          {isLastPageIndex && <span className="pagination__item" onClick={onClickNext}>{rightSiblingIndex}</span>}
          {notLast && <div>...</div>}
          {rightSiblingIndex !== totalPageCount && <span className="pagination__item" onClick={onClick}>{totalPageCount}</span>}
        </div>
        <button onClick={onClickNext} className="pagination__next-page" disabled={quantityRows >= data.length}>
          <img src={quantityRows >= data.length ? arrowNext : arrowNextActive} alt="next" />
        </button>
      </div>
    </div>
  );
}
