import dynamic from 'next/dynamic';
import ReactQuill, { ReactQuillProps } from 'react-quill';

interface ForwardedQuillComponent extends ReactQuillProps {
    forwardedRef: React.Ref<ReactQuill>;
}

const QuillNoSSRWrapper = dynamic(
    async () => {
        const { default: QuillComponent } = await import('react-quill');
        const Quill = ({ forwardedRef, ...props }: ForwardedQuillComponent) => (
            <QuillComponent ref={forwardedRef} {...props} />
        );
        return Quill;
    },
    { loading: () => <div>...loading</div>, ssr: false },
);

export default QuillNoSSRWrapper;