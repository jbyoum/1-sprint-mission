npm install -g pm2
pm2 start ecosystem.config.js
pm2 startup 
pm2 save
pm2 resurrect
pm2 list
pm2 logs