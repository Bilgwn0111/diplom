import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

interface Image {
    id: number;
    url: string;
}

interface Item {
    id: number;
    name: string;
    subname: string;
    description: string;
    price: number;
    category_id: number;
    is_active: boolean;
    images: Image[];
}

interface Props {
    items: Item[];
    categories: any[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Бараа',
        href: '/items',
    },
];

export default function Items({ items, categories }: Props) {
    const [editingItem, setEditingItem] = useState<Item | null>(null);
    const [form, setForm] = useState({
        name: '',
        subname: '',
        description: '',
        price: '',
        category_id: '', // category_id will be stored as string initially
    });
    const [images, setImages] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<Image[]>([]);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        if (editingItem) {
            setForm({
                name: editingItem.name,
                subname: editingItem.subname,
                description: editingItem.description,
                price: editingItem.price.toString(),
                category_id: editingItem.category_id.toString(), // Ensure category_id is a string for input
            });
            setExistingImages(editingItem.images);
            setImages([]);
            setIsCreating(false);
        }
    }, [editingItem]);

    const openCreateDialog = () => {
        setForm({ name: '', subname: '', description: '', price: '', category_id: '' });
        setImages([]);
        setExistingImages([]);
        setEditingItem(null);
        setIsCreating(true);
    };

    const handleToggleActive = (item: Item) => {
        router.put(`/items/${item.id}/toggle-active`, { is_active: !item.is_active }, { preserveScroll: true });
    };

    const handleSubmit = () => {
        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('subname', form.subname);
        formData.append('description', form.description);
        formData.append('price', form.price);
        formData.append('category_id', form.category_id);

        images.forEach((img) => {
            formData.append('images[]', img);
        });

        const url = isCreating ? '/items' : `/items/${editingItem?.id}`;

        if (!isCreating) formData.append('_method', 'put');

        // Convert category_id to number before sending
        router.post(url, {
            ...Object.fromEntries(formData), // Convert formData to a plain object
            category_id: Number(form.category_id), // Ensure category_id is a number
        }, {
            forceFormData: true,
            onSuccess: () => {
                setEditingItem(null);
                setIsCreating(false);
                setImages([]);
            },
        });
    };

    const handleDeleteImage = (imageId: number) => {
        if (!editingItem) return;

        router.delete(`/items/${editingItem.id}/images/${imageId}`, {
            preserveScroll: true,
            onSuccess: () => {
                setExistingImages(existingImages.filter((img) => img.id !== imageId));
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Бараанууд" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="mb-4 flex justify-end">
                    <Button onClick={openCreateDialog}>+ Add Item</Button>
                </div>

                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border p-4 md:min-h-min">
                    {items.length === 0 ? (
                        <p className="text-gray-500">No items found.</p>
                    ) : (
                        <ul className="space-y-4">
                            {items.map((item) => (
                                <li key={item.id} className="rounded-xl border bg-white p-4 shadow-sm dark:bg-neutral-900">
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <h2 className="text-xl font-semibold">
                                                {item.name} <span className="text-sm text-gray-500">({item.subname})</span>
                                            </h2>
                                            <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                                            <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">Үнэ: {item.price.toLocaleString()}₮</p>
                                        </div>

                                        <div className="mt-4 flex items-center gap-2">
                                            <Switch
                                                checked={item.is_active}
                                                onCheckedChange={() => handleToggleActive(item)}
                                                id={`switch-${item.id}`}
                                            />
                                            <label htmlFor={`switch-${item.id}`} className="text-sm">
                                                {item.is_active ? 'Active' : 'Inactive'}
                                            </label>

                                            <Button variant="outline" size="sm" className="ml-4" onClick={() => setEditingItem(item)}>
                                                Edit
                                            </Button>
                                        </div>

                                        <div className="relative w-60 shrink-0">
                                            <Carousel className="w-42">
                                                <CarouselContent>
                                                    {item.images.map((img) => (
                                                        <CarouselItem key={img.id}>
                                                            <img
                                                                src={`/storage/${img.url}`}
                                                                alt={item.name}
                                                                className="h-40 w-40 rounded border object-cover"
                                                            />
                                                        </CarouselItem>
                                                    ))}
                                                </CarouselContent>
                                                <CarouselPrevious />
                                                <CarouselNext />
                                            </Carousel>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <Dialog
                open={!!editingItem || isCreating}
                onOpenChange={() => {
                    setEditingItem(null);
                    setIsCreating(false);
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{isCreating ? 'Add New Item' : 'Edit Item'}</DialogTitle>
                    </DialogHeader>
                    <div className="mt-2 space-y-4">
                        <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                        <Input placeholder="Subname" value={form.subname} onChange={(e) => setForm({ ...form, subname: e.target.value })} />
                        <Select value={form.category_id} onValueChange={(value) => setForm({ ...form, category_id: value })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    {categories.map((category) => (
                                        <SelectItem key={category.id} value={category.id.toString()}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <Input
                            placeholder="Description"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                        />
                        <Input placeholder="Price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />

                        {existingImages.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {existingImages.map((img) => (
                                    <div key={img.id} className="relative h-24 w-24 overflow-hidden rounded border">
                                        <img src={`/storage/${img.url}`} alt="existing" className="h-full w-full object-cover" />
                                        <button
                                            onClick={() => handleDeleteImage(img.id)}
                                            className="bg-opacity-50 absolute top-0 right-0 rounded-bl bg-black px-1 text-xs text-white"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        <Input
                            type="file"
                            multiple
                            onChange={(e) => {
                                if (e.target.files) {
                                    setImages(Array.from(e.target.files));
                                }
                            }}
                        />

                        {images.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                                {images.map((image, index) => (
                                    <div key={index} className="h-24 w-24 overflow-hidden rounded border">
                                        <img src={URL.createObjectURL(image)} alt={`preview-${index}`} className="h-full w-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        )}

                        <div className="flex justify-end">
                            <Button onClick={handleSubmit}>{isCreating ? 'Create' : 'Save'}</Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
