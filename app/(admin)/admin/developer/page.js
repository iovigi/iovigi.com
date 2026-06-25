export const dynamic = 'force-dynamic';

import DeveloperContent from './DeveloperContent';

export default async function DeveloperPage() {
    const projectPath = process.cwd();

    return (
        <div className="content">
            <div className="container-fluid">
                <div className="row mb-2 mt-2">
                    <div className="col-sm-6">
                        <h1>Developer & API Settings / Настройки за разработчици и API</h1>
                    </div>
                </div>
                <DeveloperContent projectPath={projectPath} />
            </div>
        </div>
    );
}
