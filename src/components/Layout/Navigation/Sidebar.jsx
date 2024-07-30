'use client'
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { IoIosArrowDown, IoIosArrowForward } from 'react-icons/io';
import { FaUser } from 'react-icons/fa';
import { useSession, signOut } from 'next-auth/react';
import { IoSettings } from 'react-icons/io5';
import { FaHotel, FaUserTie } from 'react-icons/fa';
import { useTranslations } from 'next-intl';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react";
import { RadioGroup, Radio } from "@nextui-org/react";
import { LuLogOut } from 'react-icons/lu';
import axios from 'axios';

const Sidebar = ({ showSidebar, setShowSidebar, children, name }) => {
    const hotelSetup = process.env.NEXT_PUBLIC_HOTEL_SETUP === "true";
    const { data: session, status } = useSession();
    const t = useTranslations('Index');

    const isAdmin = () => {
        return session?.user?.admin;
    };

    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState('');

    const languages = [
        { label: 'Português', value: 'pt' },
        { label: 'Español', value: 'es' },
        { label: 'Français', value: 'fr' },
        { label: 'English', value: 'en' }
    ];

    useEffect(() => {
        const fetchLanguage = async () => {
            try {
                const response = await axios.get('/api/languageCookies');
                const languageCookie = response.data.language;
                const defaultLanguage = languages.find(lang => lang.value === languageCookie) || languages[3];
                setSelected(defaultLanguage.label);
                setSelectedLanguage(defaultLanguage.value);
            } catch (error) {
                console.error('Error fetching language cookie:', error);
            }
        };

        fetchLanguage();
    }, []);

    const handleOpen = () => {
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleLanguageSelect = async () => {
        const selectedLang = languages.find(lang => lang.label === selected);
        setSelectedLanguage(selectedLang ? selectedLang.value : '');
        console.log('Selected language:', selectedLang ? selectedLang.value : '');

        await axios.post(`/api/languageCookies`, {
            data: {
                language: selectedLang.value
            }
        });

        handleClose();

        window.location.reload(true);
    };

    const listItems = {
        settings: {
            icon: <IoSettings size={20} />,
            active: true,
            items: [
                isAdmin() && { ref: "/homepage/changePassword", label: t('sidebar.settings.changePasswordLabel'), active: true },
                isAdmin() && { ref: "/homepage/securitySettings", label: t('sidebar.settings.securitySettingsLabel'), active: true },
                isAdmin() && { ref: "/homepage/partners", label: t('sidebar.settings.partners'), active: true },
                isAdmin() && { ref: "/homepage/applications", label: t('sidebar.settings.applications'), active: true },
                isAdmin() && { ref: "/homepage/applications_categories", label: t('sidebar.settings.applicationsCategories'), active: true },
            ].filter(Boolean),
        },
        organization: {
            icon: <FaHotel size={20} />,
            active: true,
            items: [
                !isAdmin() && { ref: "/homepage/organization", label: t('sidebar.organization.accountLabel'), active: true },
                !isAdmin() && { ref: "/homepage/properties", label: t('sidebar.organization.propertiesLabel'), active: true },
                isAdmin() && { ref: "/homepage/organizations", label: t('sidebar.organization.allOrganizationsLabel'), active: true },
                isAdmin() && { ref: "/homepage/all_properties", label: t('sidebar.organization.allPropertiesLabel'), active: true },
            ].filter(Boolean),
        },
        profiles: {
            icon: <FaUserTie size={20} />,
            active: true,
            items: [
                { ref: "/homepage/profile", label: t('sidebar.profiles.manageProfilesLabel'), active: true },
                !isAdmin() && { ref: "/homepage/users", label: t('sidebar.profiles.manageUsersLabel'), active: true },
                isAdmin() && { ref: "/homepage/all_users", label: t('sidebar.profiles.manageAllUsersLabel'), active: true },
            ].filter(Boolean)
        }
    };

    return (
        <>
            <aside className={(showSidebar ? "" : "hidden ") + "bg-white h-screen border-r border-bg-primary overflow-hidden w-72 flex shrink-0 fixed top-0 z-40 inset-0 lg:block z-100"} aria-label="Sidebar">
                <div className="h-full w-full no-scrollbar px-3 pb-4 bg-white text-bg-primary">
                    <Link href="/homepage">
                        <div className="flex justify-center">
                            <div className="w-30 h-30 mt-8">
                                <Image src="/images/logo.png" alt="Logotipo" width={150} height={150} />
                            </div>
                        </div>
                    </Link>

                    <hr className="border-t border-primary-800 my-4" />

                    <ul className="space-y-2 h-full max-h-[calc(100vh-330px)] overflow-y-auto">
                        {children}
                        {Object.entries(listItems).map(([key, { icon, items, active }], index) =>
                            <li key={index}>
                                <ProfileDropdown title={t(`sidebar.${key}.label`)} labels={items} icon={icon} active={active} />
                            </li>
                        )}
                    </ul>

                    <hr className="border-t border-primary-800 my-4" />

                    <div className="flex justify-between gap-x-2">

                        <Button size="sm" className="bg-slate-200 uppercase" onClick={handleOpen}>
                            {selectedLanguage.toUpperCase()}
                        </Button>
                        <Modal isOpen={isOpen} onOpenChange={setIsOpen}>
                            <ModalContent>
                                {(onClose) => (
                                    <>
                                        <ModalHeader className="flex flex-col gap-1">Select Language</ModalHeader>
                                        <ModalBody>
                                            <div className="flex flex-col gap-3">
                                                <RadioGroup value={selected} onValueChange={setSelected}>
                                                    {languages.map((language) => (
                                                        <Radio key={language.value} value={language.label}>
                                                            {language.value.toUpperCase()} - {language.label}
                                                        </Radio>
                                                    ))}
                                                </RadioGroup>
                                                <p className="text-default-500 text-small">Selected: {selected}</p>
                                            </div>
                                        </ModalBody>
                                        <ModalFooter>
                                            <Button color="danger" variant="light" onClick={onClose}>
                                                Close
                                            </Button>
                                            <Button color="primary" onClick={handleLanguageSelect}>
                                                Choose
                                            </Button>
                                        </ModalFooter>
                                    </>
                                )}
                            </ModalContent>
                        </Modal>
                        <div className='flex flex-row gap-2'>
                        <FaUser className="text-2xl text-primary-800 ml-2" />
                        {status === 'authenticated' && session && (
                            <span className="text-md text-primary-800 font-semibold ml-1 mt-0.5">{`${session.user.name} ${session.user.lastname}`}</span>
                        )}
                        </div>
                        {/*<Button size="sm" className="bg-red-500 ml-2" onClick={() => signOut()}>
                            <LuLogOut className='text-white' size={15} />
                        </Button>*/}
                    </div>

                    <br />
                </div>
            </aside>

            <div
                className={(showSidebar ? "" : "hidden ") + "fixed inset-0 z-10 bg-gray-900/50 lg:hidden"}
                onClick={() => setShowSidebar(false)}
            />
        </>
    );
};

const ProfileDropdown = ({ title, labels, icon, active }) => {
    const pathname = usePathname();
    const router = useRouter();

    const isActive = labels.some(({ ref }) => pathname === ref);
    const [isOpen, setIsOpen] = useState(isActive);

    return (
        <>
            <header
                className={(isActive ? "text-primary-800 bg-primary-600" : "text-primary-800") + " flex items-center justify-between cursor-pointer p-1 pr-2 rounded-lg hover:bg-primary-600 hover:text-primary-800 transition ease-in-out duration-150"}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="ml-2 flex items-center">
                    {active && icon && <span className="mr-2">{icon}</span>}
                    {active && title && <h2 className="text-lg font-semibold">{title}</h2>}
                </div>
                {active && (isOpen ? <IoIosArrowDown /> : <IoIosArrowForward />)}
            </header>

            <ul title={title} className={isOpen ? "my-2 " : "hidden mb-2 "}>
                {labels.map(({ ref, label, active }, index) => {
                    const linkIsActive = pathname === ref;
                    const disabled = !active && ref !== "/";

                    return (
                        <li
                            key={index}
                            className={(linkIsActive ? "text-primary-800 font-bold bg-primary-600" : "text-primary-800") + " ml-2 my-1 p-2 text-sm rounded-lg cursor-pointer hover:bg-primary-600 hover:text-primary-800 active:ring transition ease-in-out duration-150"}
                            onClick={() => !disabled && router.push(ref)}
                            style={{ opacity: disabled ? 0.5 : 1, cursor: disabled ? "not-allowed" : "pointer" }}
                        >
                            {!disabled ? label : null}
                            {disabled && (
                                <span className="ml-2 text-red-500"></span>
                            )}
                        </li>
                    );
                })}
            </ul>
        </>
    );
};


export default Sidebar;