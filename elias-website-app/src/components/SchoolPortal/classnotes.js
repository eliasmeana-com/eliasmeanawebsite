import { useParams } from 'react-router-dom';
import LatexEditor from '../../utils/latexUtils/LatexEditor';
import useClassName from '../../utils/hooks/useClassName';
import useLatexDocument from '../../utils/latexUtils/LatexPageFunctions';
import '../../styles/latexPage.css';


function LatexTestPage() {
    const { pageCode } = useParams();
    // const location = useLocation();
    const {
        latexScript,
        inputValue,
        setInputValue,
        status,
        editMode,
        setEditMode,
        saveLatex,
    } = useLatexDocument({ type: 'classnotes', pageCode });
    const { className, status: classNameStatus } = useClassName(pageCode);

    return (
        <LatexEditor
            inputValue={inputValue}
            setInputValue={setInputValue}
            editMode={editMode}
            setEditMode={setEditMode}
            saveLatex={saveLatex}
            latexScript={latexScript}
            status={status}
            heading1={`Notes for ${className || 'Loading...'}`}
            extraStatus={[classNameStatus]}
        />
    );
}

export default LatexTestPage;
