export const dynamic = 'force-dynamic';

import dbConnect from '@/lib/db';
import Setting from '@/models/Setting';
import SettingsForm from './SettingsForm';

async function getSettings() {
    await dbConnect();
    const settings = await Setting.find({});
    const settingsObj = {};
    settings.forEach(s => {
        settingsObj[s.key] = s.value;
    });
    return JSON.parse(JSON.stringify(settingsObj));
}

export default async function SettingsPage() {
    const settings = await getSettings();

    return (
        <div className="content">
            <div className="container-fluid">
                <div className="row mb-2 mt-2">
                    <div className="col-sm-6">
                        <h1>Settings</h1>
                    </div>
                </div>
                <SettingsForm initialSettings={settings} />
            </div>
        </div>
    );
}
