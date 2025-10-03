import Label from "../ui/Label.jsx";
import Input from "../ui/Input.jsx";

export default function FormField({ label, id, ...inputProps }) {
    return (
    <div className="space-y-2">
        <Label htmlFor={id}>{label}</Label>
        <Input id={id} {...inputProps} />
    </div>
    );
}
