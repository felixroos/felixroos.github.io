import { classNames } from '../layout/classNames';

function QueryTable({ cols, values, length }) {
  return (
    <table className="table-fixed" cellPadding="10px">
      <tr className="border-b-2">
        <th className="border-r-2">Q</th>
        {values.map((col, q) => (
          <td key={q} className={classNames('py-0 px-4', length === q + 1 ? 'border-r-2 border-dotted' : '')}>
            {q}
          </td>
        ))}
      </tr>
      <tr>
        <th className="border-r-2">V</th>
        {values.map((value, q) => (
          <td key={q} className={classNames('py-0 px-4', length === q + 1 ? 'border-r-2 border-dotted' : '')}>
            {value}
          </td>
        ))}
      </tr>
      {cols.map((col, c) => (
        <tr key={c}>
          <th className="border-r-2">
            B<sub>{c}</sub>
          </th>
          {col.map((i, q) => (
            <td key={q} className={classNames('py-0 px-4', length === q + 1 ? 'border-r-2 border-dotted' : '')}>
              {i}
            </td>
          ))}
        </tr>
      ))}
    </table>
  );
}

export default QueryTable;
