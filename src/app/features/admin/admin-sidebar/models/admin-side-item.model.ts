export interface AdminSidebarItemModel {
    label: string;
    icon?: string;
    route?: string;
    children?: AdminSidebarItemModel[];
    expanded?: boolean;
}
