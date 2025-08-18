import { cellStyle } from "../../types/board.type";

export const Cell = ({
  type,
  id,
  safe,
}: {
  id: string;
  type: string;
  safe?: string;
}) => {
  return (
    <>
      <div
        id={id}
        className={`${cellStyle[type]} w-full h-full flex items-center justify-center`}
      >
        {safe && (
            <img src="/icons/star.svg" alt="safe" className=""/>
        )}
      </div>
    </>
  );
};
