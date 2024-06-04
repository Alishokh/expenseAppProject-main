import {FC} from 'react'

//mui imports
import {Skeleton, TableBody, TableCell, TableRow} from '@mui/material'

type TableSkeletonPropsType = {
  columnsCount: number
  rowsCount: number
}

export const TableBodySkeleton: FC<TableSkeletonPropsType> = ({columnsCount, rowsCount}) => {
  const cells = new Array(columnsCount).fill('').map((_, i) => {
    return (
      <TableCell key={i}>
        <Skeleton animation={'pulse'} height={35}/>
      </TableCell>
    )
  })

  const rows = new Array(rowsCount).fill('').map((_, i) => {
    return <TableRow key={i}>{cells}</TableRow>
  })

  return <TableBody>{rows}</TableBody>
}