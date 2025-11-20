using UnityEngine;
using NotebookWar.Input;

namespace NotebookWar.Weapons
{
    public abstract class WeaponBase : MonoBehaviour
    {
        [SerializeField] protected WeaponData weaponData;
        [SerializeField] protected Transform firePoint;
        [SerializeField] protected LayerMask hitLayers;

        protected int currentAmmo;
        protected float nextFireTime;
        protected bool isReloading;
        protected IInputProvider input;

        protected virtual void Awake()
        {
            currentAmmo = weaponData.magazineSize;
            input = new KeyboardMouseInput();
        }

        protected virtual void Update()
        {
            if (isReloading)
                return;

            if (input.GetReloadInput() && currentAmmo < weaponData.magazineSize)
            {
                StartReload();
                return;
            }

            if (CanFire())
            {
                if (weaponData.isAutomatic && input.GetFireInput())
                    Fire();
                else if (!weaponData.isAutomatic && input.GetFireInput())
                    Fire();
            }
        }

        protected virtual bool CanFire()
        {
            return currentAmmo > 0 && Time.time >= nextFireTime && !isReloading;
        }

        protected virtual void Fire()
        {
            currentAmmo--;
            nextFireTime = Time.time + weaponData.fireRate;

            if (Physics.Raycast(firePoint.position, firePoint.forward, out RaycastHit hit, weaponData.range, hitLayers))
            {
                OnHit(hit);
            }
        }

        protected virtual void OnHit(RaycastHit hit)
        {
            IDamageable damageable = hit.collider.GetComponent<IDamageable>();
            if (damageable != null)
            {
                damageable.TakeDamage(weaponData.damage);
            }
        }

        protected virtual void StartReload()
        {
            isReloading = true;
            Invoke(nameof(FinishReload), weaponData.reloadTime);
        }

        protected virtual void FinishReload()
        {
            currentAmmo = weaponData.magazineSize;
            isReloading = false;
        }

        public int GetCurrentAmmo() => currentAmmo;
        public int GetMaxAmmo() => weaponData.magazineSize;
        public bool IsReloading() => isReloading;
    }

    public interface IDamageable
    {
        void TakeDamage(float damage);
    }
}
