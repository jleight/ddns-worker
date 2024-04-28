# ddns-worker

Cloudflare Worker for handling DDNS requests.

## Usage

Here's a quick guide on how to get this working:

1. Clone this repository.
2. Run `npm install` to install the dependencies.
3. Run `npm deploy` to deploy your worker.
4. Open your UniFi controller and go to Settings > Internet > *Your WAN Connection*.
5. Make sure Advanced mode is set to Manual.
6. Click the "Create New Dynamic DNS" button and enter the following settings:
   - **Service:** custom
   - **Hostname:** your DDNS domain
   - **Username:** the name of the record you want to update
   - **Password:** an API token that has access to modify DNS in your Cloudflare zone
   - **Server:** `your-worker.your-account.workers.dev/update?z=your-zone-id&r=your-record-id&i=%i`
7. Click the "Create" button.

Now you can test your setup by:

1. SSH into your UniFi controller.
2. Run `ps aux | grep inadyn` and copy the path to your inadyn configuration file.
3. Run `inadyn -n -1 --force -f /path/to/inadyn.conf`.
4. Check the comments in your DDNS record to see if it was updated.
