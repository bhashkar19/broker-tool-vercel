-- Create storage bucket for broker logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('broker-logos', 'broker-logos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public read access to broker logos
CREATE POLICY "Public Access to Broker Logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'broker-logos');

-- Allow authenticated users to upload logos (for admin management)
CREATE POLICY "Authenticated users can upload logos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'broker-logos');

-- Allow authenticated users to update logos
CREATE POLICY "Authenticated users can update logos"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'broker-logos');

-- Allow authenticated users to delete logos
CREATE POLICY "Authenticated users can delete logos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'broker-logos');
