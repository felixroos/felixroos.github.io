import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer';

export default function DiffViewer(props) {
  return (
    <div className="not-prose">
      <ReactDiffViewer
        compareMethod={DiffMethod.LINES}
        splitView={false}
        showDiffOnly={false}
        useDarkTheme={true}
        hideLineNumbers={true}
        {...props}
      />
    </div>
  );
}
